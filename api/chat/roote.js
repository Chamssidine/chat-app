import validateChatRequest from "../middleware/validateChatRequest.js";
import {getConversation, normalizeMessages, saveMessage} from "./conversationService.js";
import { sendMessage } from "./openaiService.js";
import {handleFunctionCall, runToolCallsAndRespond} from "./functionHandler.js";
import {uploadBase64Pdf} from "./fileService.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";


// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptPath = path.join(__dirname, "developerPrompt.md");
const developerPromptContent = fs.readFileSync(promptPath, "utf-8");
const developerMessage = {
    role: "system",
    content: developerPromptContent,
};




export default async function handler(req, res) {
    try {
        validateChatRequest(req, res, () => {});
        let {
            message = "",
            model = "gpt-3.5-turbo",
            sessionId,
            image,
            role = "user",
            userId,
            file,
        } = req.body;


        let userMessage = [];
        let fileId;
        if(image) {
            fileId = await uploadBase64Pdf(image);
            console.log("image uploaded" + fileId);
            model = "gpt-4.1";
            userMessage = {
                role: role,
                content: [
                    { type: "text", text: message || "" },
                    {
                        type: "input_image",
                        image_url:fileId,
                        detail: "high"
                    },
                ],
            }
        } else if(file) {
            fileId = await uploadBase64Pdf(file.data);
            userMessage = {
                role: role,
                content:[
                    { type: "text", text: message},
                    {
                        type: "file",
                        filename: file.name,
                        file_id: fileId,
                        file_data: "deja chargeé",
                    },
                ],
            };
        }else {
            userMessage = {
                role: role,
                content: message,
            };
        }


        let conversation = await getConversation(sessionId);
       // await saveMessage(sessionId, developerMessage);
        await saveMessage(sessionId, userMessage);
        conversation = await getConversation(sessionId);

        const aiRes = await sendMessage(normalizeMessages(conversation.messages),model);

        const msg = aiRes.choices[0].message;

        const toolCalls = msg.tool_calls || [];

        await saveMessage(sessionId, msg);

        if (toolCalls.length > 0) {
            const finalMsg = await runToolCallsAndRespond({
                toolCalls,
                sessionId,
                userId,
                saveMessage,
                sendMessage,
                fileId,
                model
            });

            return res.status(200).json({ message: finalMsg });
        }



        return res.status(200).json({ message: msg });

    } catch (error) {
        console.error(error);
        return res.status(error.response?.status || 500).json({ error: error.message });
    }
}
