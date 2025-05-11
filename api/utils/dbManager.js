import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";

mongoose
    // eslint-disable-next-line no-undef
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

export const findOrCreateConversation = async (sessionId) => {

    let conversation = await Conversation.findOne({sessionId});
    if(!conversation) {
        conversation = new Conversation({sessionId, userId: "1234567890", messages: [], conversationName: "New Discussion"});
        await conversation.save();
    }

    return conversation;
};


export const saveMessageToDb = async (conversationId, message) => {
    const conversation = await Conversation.findOne({ sessionId: conversationId });
    conversation.messages.push(message);
    await conversation.save();
};

export const updateConversationNameDb = async (conversationId, newConversationName) => {
    const conversation = await Conversation.findOne({ sessionId: conversationId });
    if (!conversation) return;
    conversation.conversationName = newConversationName;
    await conversation.save(); // ← important
};
