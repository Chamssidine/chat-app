const processPdfFn = {
    type: "function",
    function:{
        name: "process_pdf",
        description:
            "Utilise GPT-4.1 pour analyser un fichier PDF donné en Base64 et traiter la consigne fournie.",
        parameters: {
            type: "object",
            properties: {
                prompt: {
                    type: "string",
                    description: "Instruction ou question à appliquer au contenu du PDF.",
                },
                model: {
                    type: "string",
                    description: "Modèle OpenAI à employer (par défaut gpt-4.1).",
                    default: "gpt-4.1",
                },
            },
            required: ["prompt"],
        },

    }
};

// Function definition for image creation
const createImageFn = {
    type: "function",
    function: {
        name: "image_gen",
        description: "Generate an image based on a text prompt using DALL·E.",
        parameters: {
            type: "object",
            properties: {
                prompt: { type: "string", description: "Prompt for the image." },
                model: {
                    type: "string",
                    description: "DALL·E model to use",
                    default: "dall-e-3",
                },
                n: { type: "integer", description: "Number of images", default: 1 },
                size: {
                    type: "string",
                    description: "Resolution, e.g. 1024x1024",
                    default: "1024x1024",
                },
            },
            required: ["prompt"],
        },
    },
};

const giveConversationNameFn = {
    type: "function",
    function: {
        name: "rename_conversation",
        description:
            "Give a name to the conversation based on its context and content",
        parameters: {
            type: "object",
            properties: {
                prompt: {
                    type: "string",
                    description: "Prompt for giving name to conversation",
                },
                model: {
                    type: "string",
                    description: "gpt-4o model to use",
                    default: "gpt-4o",
                },
            },
            required: ["prompt"],
        },

    }
};

export function getCallableFunctions() {
    return [processPdfFn, createImageFn, giveConversationNameFn];
}
