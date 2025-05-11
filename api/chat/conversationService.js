
import {findOrCreateConversation, saveMessageToDb, updateConversationNameDb} from "../utils/dbManager.js";

export async function getConversation(sessionId) {
    return await findOrCreateConversation(sessionId);
}

export async function saveMessage(conversationId,message) {
    await saveMessageToDb(conversationId, message);
}

export async function updateConversationName(conversationId,newConversationName) {
    await  updateConversationNameDb(conversationId,newConversationName);
}
