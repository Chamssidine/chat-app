import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import handler from "./roote.js";
import Conversation from "../models/Conversation.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port =  3000;
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));


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
    const deletedConversation = await Conversation.findOneAndDelete({
      sessionId,
    });

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
  const { sessionID, conversationName } = req.body;

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

app.post("/api/chat", handler);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
