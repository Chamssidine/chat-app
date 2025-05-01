import express from "express";
import cors from "cors";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import fs from 'fs';
import mongoose from "mongoose";
import Conversation from "./src/models/Conversation.js"; // import our new model

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptPath = path.join(__dirname, 'developerPrompt.md');
const developerPromptContent = fs.readFileSync(promptPath, 'utf-8');

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Express setupc
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));


const developerMessage = {
  role: 'developer',
  content: developerPromptContent,
};

// Function definition for image creation
const createImageFn = {
  name: "create_image",
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
};

const giveConversationNameFn = {
  name: "give_conversation_name", // Corrected typo here
  description:
    "Give a name to the conversation based on its context and content",
  parameters: {
    type: "object", // Explicitly declaring the type as object
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
};

function normalizeMessages(msgs) {
  return msgs
    .filter((m) => {
      if (!m.role || m.content == null) return false;
      if (m.role === "function" && !m.name) return false;
      return true;
    })
    .map((m) => {
      const base = {
        role: m.role,
        content: m.content,
      };
      if (m.role === "function") {
        base.name = m.name;
      }
      return base;
    });
}

function isImageModel(model) {
  return model.toLowerCase().startsWith("dall-e");
}

app.get("/api/chat/conversation/fetch", async (req, res) => {
  try {
    const conversations = await Conversation.find({}); // Fetch ALL conversations
   // console.log(conversations);
    res.status(200).json({ sessions: conversations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});


app.delete("/api/chat/conversation/delete/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    console.log(sessionId);
    const deletedConversation = await Conversation.findOneAndDelete({ sessionId });

    if (!deletedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
});

// Fetch conversation by sessionId
app.get("/api/chat/conversation/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ messages: conversation.messages });
  } catch (err) {
    console.error("Error fetching conversation:", err.message);
    res.status(500).json({ error: "Error fetching conversation" });
  }
});

app.post("/api/chat/conversation/rename/", async (req, res) => {
  console.log("Request Body:", req.body); // Log the request body to confirm

  // Use the exact keys as in the request body
  const { sessionID, conversationName } = req.body;

  // Log sessionID and conversationName for debugging
  console.log("sessionID:", sessionID);
  console.log("conversationName:", conversationName);

  if (!sessionID || !conversationName) {
    return res
      .status(400)
      .json({ error: "Missing sessionID or conversationName" });
  }

  try {
    const conversation = await Conversation.findOne({ sessionId: sessionID });

    if (!conversation) {
      console.error("Conversation not found with sessionId:", sessionID);
      return res.status(404).json({ error: "Conversation not found" });
    }

    conversation.conversationName = conversationName;
    await conversation.save();

    return res.json({ reply: "Renamed successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error renaming conversation: " + err.stack });
  }
});

// Chat endpoint with function-calling support
app.post("/api/chat", async (req, res) => {
  const {
    message = "",
    model = "gpt-3.5-turbo",
    sessionId,
    image,
    role = "user",
    userId,
  } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required." });
  if (!userId) return res.status(400).json({ error: "userId is required." });
  if (!sessionId)
    return res.status(400).json({ error: "sessionId is required." });

  try {
    // Load or create conversation based on sessionId
    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = new Conversation({ sessionId, userId, messages: [] });
      conversation.messages.push(developerMessage)
      await conversation.save();
    }

    // Create the message to add
    const userMessage = image
      ? {
          role: role,
          content: [
            { type: "text", text: message || "" },
            {
              type: "image_url",
              image_url: { url: image, detail: "auto" },
            },
          ],
        }
      : {
          role: role,
          content: message,
        };

    // Push the new message to the conversation
    conversation.messages.push(userMessage);
    await conversation.save();

    // Image generation logic if needed
    if (isImageModel(model)) {
      const imageRes = await openai.images.generate({
        model,
        prompt: message,
        n: 1,
        size: "1024x1024",
      });
      const imageUrl = imageRes.data[0]?.url;
      const assistantReply = { role: "assistant", content: imageUrl };
      conversation.messages.push(assistantReply);
      await conversation.save();

      return res.json({ reply: imageUrl });
    }

    const initial = await openai.chat.completions.create({
      model,
      messages: normalizeMessages(conversation.messages),
      functions: [createImageFn, giveConversationNameFn],
      function_call: "auto",
    });

    const msg = initial.choices[0].message;

    if (
      msg.function_call &&
      msg.function_call.name === giveConversationNameFn.name
    ) {
      try {
        // Parse the function call arguments to get the new name
        const fnArgs = JSON.parse(msg.function_call.arguments || "{}");
        const newConversationName = `${fnArgs.prompt}`;

        console.log(
          "Attempting to update conversation name:",
          newConversationName
        );

        // Find the existing conversation by sessionId
        const conversation = await Conversation.findOne({
          sessionId: sessionId,
        });

        if (!conversation) {
          console.error("Conversation not found with sessionId:", sessionId);
          return res.status(404).json({ error: "Conversation not found" });
        }

        // Update the conversation name
        conversation.conversationName = newConversationName;

        // Add system message confirming the new name (optional)
        conversation.messages.push({
          role: "system",
          content: `Conversation renamed to: ${newConversationName}`,
        });

        // Save the updated conversation
        await conversation.save();
        console.log(
          "Conversation name updated successfully:",
          newConversationName
        );

        // Now the conversation name is updated, move to the next message flow
        const finalChat = await openai.chat.completions.create({
          model,
          messages: normalizeMessages(conversation.messages),
        });

        // Check if final response is valid
        if (!finalChat.choices || finalChat.choices.length === 0) {
          console.error("No response from OpenAI for final message.");
          return res.status(500).json({ error: "No response from OpenAI." });
        }

        const finalMsg = finalChat.choices[0].message.content;

        console.log("Final assistant message:", finalMsg);

        // Update the conversation with the assistant's response
        conversation.messages.push({
          role: "assistant",
          content: finalMsg,
        });

        await conversation.save();

        // Send the final response to the client
        return res.json({ reply: finalMsg });
      } catch (error) {
        console.error(
          "Error updating conversation or processing response:",
          error.message
        );
        return res.status(500).json({ error: error.message });
      }
    }

    if (msg.function_call) {
      const fnArgs = JSON.parse(msg.function_call.arguments || "{}");

      const imgRes = await openai.images.generate({
        model:
          fnArgs.model ?? createImageFn.parameters.properties.model.default,
        prompt: fnArgs.prompt,
        n: fnArgs.n ?? createImageFn.parameters.properties.n.default,
        size: fnArgs.size ?? createImageFn.parameters.properties.size.default,
      });
      const imageUrl = imgRes.data[0]?.url;

      conversation.messages.push({
        role: "function",
        name: msg.function_call.name,
        content: JSON.stringify({ url: imageUrl }),
      });

      const finalChat = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "When replying, do not use markdown or embed images. Only write plain text.",
          },
          ...normalizeMessages(conversation.messages),
        ],
      });

      const finalMsg = finalChat.choices[0].message.content;

      conversation.messages.push({
        role: "assistant",
        content: finalMsg,
      });

      await conversation.save();

      return res.json({ reply: finalMsg, imageUrl });
    }

    const textReply = msg.content;
    conversation.messages.push({
      role: "assistant",
      content: textReply,
    });

    await conversation.save();

    res.json({ reply: textReply });
  } catch (err) {
    console.error(
      "Error /api/chat:",
      err.message,
      err.response?.data || err.stack
    );
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
