import OpenAI from "openai";

const client = new OpenAI();

export async function  search(input) {

    return client.responses.create({
        model: "gpt-4.1",
        tools: [{type: "web_search_preview"}],
        input: input,
    });

}