import {generateImageFromPrompt} from "../utils/image_generator.js";
import {saveMessage, updateConversationName} from "./conversationService.js";
import {FUNCTION_NAMES} from "./constants.js";
import {processPdf} from "./fileService.js";

export async function handleFunctionCall(toolCall, userId, sessionId, fileId = null) {
    if (toolCall.function.name === FUNCTION_NAMES.PROCESS_PDF) {
        console.log("prop pdf called");
        return await processPdf(toolCall, fileId);

    }
    if (toolCall.function.name === FUNCTION_NAMES.IMAGE_GEN) {
        console.log("image gen called");
        const args = JSON.parse(toolCall.function.arguments);
        return await generateImageFromPrompt(args.prompt, userId, sessionId);
    }
    if(toolCall.function.name === FUNCTION_NAMES.RENAME_CONVERSATION){

        try {
            console.log("conversqtion rename called");
            const args = JSON.parse(toolCall.function_call.arguments || "{}");
            const newConversationName = `${args.prompt}`;

            await updateConversationName(sessionId,newConversationName);

            const systemMessage = {
                role : "system",
                content: `Conversation renamed to: ${newConversationName}`
            }

            await saveMessage(sessionId,systemMessage)
            return  systemMessage

        } catch (err) {
                console.log(err);
        }
    }
}
