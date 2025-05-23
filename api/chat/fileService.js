import OpenAI from "openai";
import path from "path";
import fs from "fs";
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



let fileID = "";
export async function uploadBase64Pdf(base64String, filename = "document.pdf") {

    // eslint-disable-next-line no-undef
    const buffer = Buffer.from(base64String, "base64");


    const tempFilePath = path.join(__dirname, filename);


    fs.writeFileSync(tempFilePath, buffer);



    const uploadedFile = await openai.files.create({
        file: fs.createReadStream(tempFilePath), // Create a readable stream from the file
        purpose: "assistants",
    });


    fs.unlinkSync(tempFilePath);
    fileID = uploadedFile.id;
    return uploadedFile.id;
}
const openai = new OpenAI({
    apiVersion: "2024-05-15",
});
async function analyzePdfWithGpt(prompt, fileId) {

    console.log("analyze PDF called file id: ", prompt);
    const gptResponse = await openai.responses.create({
        model: "gpt-4.1",
        input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: prompt
                    },
                    {
                        type: "input_file",
                        file_id: fileId
                    }
                ]
            }
        ]
    });

    const answer = gptResponse.output_text || "Aucune réponse générée par GPT.";
    console.log(answer);
    return answer;
}

export async function processPdf(toolCall, fileId = fileID) {
    const args = JSON.parse(toolCall.function.arguments);
    return await analyzePdfWithGpt(args.prompt, fileId);
}
