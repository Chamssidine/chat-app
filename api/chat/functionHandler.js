import {generateImageFromPrompt} from "../utils/image_generator.js";
import {getConversation, normalizeMessages, updateConversationName} from "./conversationService.js";
import {FUNCTION_NAMES} from "./constants.js";
import {processPdf} from "./fileService.js";

export async function handleFunctionCall(toolCall, userId, sessionId, fileId = null) {
    const functionName = toolCall.function.name;

    if (functionName === FUNCTION_NAMES.PROCESS_PDF) {
        console.log("process pdf called");

        const result =  await processPdf(toolCall, fileId);
        return {
            role: "assistant",
            name: functionName,
            content: result
        };

    }

    if (functionName === FUNCTION_NAMES.IMAGE_GEN) {
        console.log("image gen called");
        const args = JSON.parse(toolCall.function.arguments || "{}");

        const result = await generateImageFromPrompt(args.prompt, userId, sessionId);

        // Assure que result est bien une string ou un objet JSON.stringify-able
        const content = typeof result === "string" ? result : JSON.stringify(result);

        return {
            role: "assistant",
            name: functionName,
            content: content
        };
    }

    if (functionName === FUNCTION_NAMES.RENAME_CONVERSATION) {
        try {
            console.log("conversation rename called");
            const args = JSON.parse(toolCall.function.arguments || "{}");
            const newConversationName = `${args.prompt}`;

            await updateConversationName(sessionId, newConversationName);

            return {
                role: "assistant",
                name: functionName,
                content: `✅ La conversation a bien été renommée en **${newConversationName}**.`

            };

        } catch (err) {
            console.error("Error in rename_conversation:", err);
            return {
                role: "function",
                name: functionName,
                content: `Error: ${err.message}`
            };
        }
    }


    return {
        role: "function",
        name: functionName,
        content: `Function "${functionName}" not recognized or implemented.`
    };
}

export async function runToolCallsAndRespond({
                                                 toolCalls,
                                                 sessionId,
                                                 userId,
                                                 handleFunctionCall,
                                                 saveMessage,
                                                 sendMessage,
                                                 fileId,
                                                 model
                                             }) {

    for (const call of toolCalls) {
        const toolResponse = await handleFunctionCall(call, userId, sessionId, fileId)
        console.log("tool response", toolResponse);

        await saveMessage(sessionId, toolResponse);

    }

    const updatedConversation = await getConversation(sessionId);
    console.log("updated conversation", updatedConversation);
    const followUp = await sendMessage(
        normalizeMessages(updatedConversation.messages),
        model
    );
    const finalMsg = followUp.choices[0].message;
   console.log("final msg", finalMsg);

    await saveMessage(sessionId, {
        role: finalMsg.role,
        content: finalMsg.content,
        name: finalMsg.name,
        tool_calls: finalMsg.tool_calls
    });
    return finalMsg;
}

