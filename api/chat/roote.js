import validateChatRequest from "../middleware/validateChatRequest.js";
import {getConversation, saveMessage} from "./conversationService.js";
import { sendMessage } from "./openaiService.js";
import { handleFunctionCall } from "./functionHandler.js";
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
function normalizeMessages(msgs) {
    return msgs
        .filter(m => {
            // only allow the four supported roles
            if (!["system","user","assistant","function"].includes(m.role)) {
                return false;
            }
            // function messages must also have a name
            if (m.role === "function" && !m.name) {
                return false;
            }
            // must have either text or a file attachment
            if (m.content == null && !m.file) {
                return false;
            }
            return true;
        })
        .map(m => {
            const out = { role: m.role };

            // for functions, re-attach the name
            if (m.role === "function") {
                out.name = m.name;
            }

            // preserve any PDF/image attachments
            if (m.file) {
                out.file = {
                    data: m.file.data,
                    filename: m.file.filename,
                    mimetype: m.file.mimetype
                };
            }

            // ensure content is always a string
            out.content = typeof m.content === "string"
                ? m.content
                : JSON.stringify(m.content);

            return out;
        });
}

export default async function handler(req, res) {
    try {
        validateChatRequest(req, res, () => {});
        const {
            message = "",
            model = "gpt-3.5-turbo",
            sessionId,
            image,
            role = "user",
            userId,
            file,
        } = req.body;


        let userMessage = [];
        if(image) {
            userMessage = {
                role: role,
                content: [
                    { type: "text", text: message || "" },
                    {
                        type: "image_url",
                        image_url: { url: image, detail: "auto" },
                    },
                ],
            }
        } else if(file) {
            await uploadBase64Pdf(file.data);
            userMessage = {
                role: role,
                content:[
                    { type: "text", text: message},
                    {
                        type: "file",
                        filename: file.name,
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
        await saveMessage(sessionId, developerMessage);
        await saveMessage(sessionId, userMessage);
        conversation = await getConversation(sessionId);

        const aiRes = await sendMessage(normalizeMessages(conversation.messages),model);

        const msg = aiRes.choices[0].message;

        const toolCalls = msg.tool_calls || [];

        await saveMessage(sessionId, msg);

        if (toolCalls.length > 0) {
            for (const toolCall of toolCalls) {
                const toolResponse = await handleFunctionCall(toolCall, userId, sessionId);
                const message = {
                    role: "function",
                    content: [
                        { type: "text", text: toolResponse.content },
                    ],
                }
                await saveMessage(conversation.id, message);
            }
            const followUp = await sendMessage(normalizeMessages(conversation.messages));
            const finalMsg = followUp.choices[0].message;
            await saveMessage(sessionId, finalMsg.role, finalMsg.content || "", finalMsg.tool_calls || []);
        }

        return res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error(error);
        return res.status(error.response?.status || 500).json({ error: error.message });
    }
}
