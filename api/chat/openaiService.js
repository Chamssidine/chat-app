import OpenAI from "openai";
import {truncateMessagesToTokenLimit} from "../../src/utils/truncateMessages.js";
import {getCallableFunctions} from "../utils/callable_functions.js";
const openai = new OpenAI();

export async function sendMessage(messages,model) {
    console.log(messages);
    const limitedMessages = truncateMessagesToTokenLimit(messages);
    return openai.chat.completions.create({
        model: model,
        messages: limitedMessages,
        functions:getCallableFunctions(),
        function_call: "auto",
    });
}
