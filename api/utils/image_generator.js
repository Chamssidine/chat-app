import OpenAI from "openai";

const openai = new OpenAI({
    apiVersion: "2024-05-15"
});

async function generateImage(prompt, model = "dall-e-3") {


    const imageRes = await openai.images.generate({
        model,
        prompt,
        n: 1,
        size: "1024x1024",
    });

    const imageUrl = imageRes.data[0]?.url;
    return imageUrl;
}

export async function generateImageFromPrompt(prompt) {
    return await generateImage(prompt);
}
