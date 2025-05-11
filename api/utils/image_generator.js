import OpenAI from "openai";

const openai =  new OpenAI();

async function generateImage(prompt,model="dall-e-3"){
    console.log("prompt");
    console.log(prompt);
    const imageRes = await openai.images.generate({
        model,
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    });
    console.log(imageRes);
    const imageUrl = imageRes.data[0]?.url;

    return {role: "assistant", content: imageUrl};
}

export async function  generateImageFromPrompt(prompt){

    return await generateImage(prompt);
}


