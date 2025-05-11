
import {findOrCreateConversation, saveMessageToDb, updateConversationNameDb} from "../utils/dbManager.js";

export function normalizeMessages(msgs) {
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

export async function getConversation(sessionId) {
    return await findOrCreateConversation(sessionId);
}

export async function saveMessage(conversationId,message) {
    await saveMessageToDb(conversationId, message);
}

export async function updateConversationName(conversationId,newConversationName) {
    await  updateConversationNameDb(conversationId,newConversationName);
}
