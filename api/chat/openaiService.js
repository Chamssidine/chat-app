import OpenAI from "openai";
import {trimConversation} from "../../src/utils/truncateMessages.js";
import {getCallableFunctions} from "../utils/callable_functions.js";
const openai = new OpenAI({
    apiVersion: "2024-05-15",
});

export async function sendMessage(messages, model) {

    console.log("sending message", messages);
    // const limitedMessages = truncateMessagesToTokenLimit(messages);
    const recentMessages = trimConversation(messages);
    const airesponse = await openai.chat.completions.create({
        model,
        messages: recentMessages,
        tools: getCallableFunctions(),      // renamed from "functions"
        tool_choice: "auto",                // replaces "function_call"
    });
    return airesponse
}
