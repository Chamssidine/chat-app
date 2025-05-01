import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, required: true },
  content: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },  // Mixed allows for any type of content (string, object, etc.)
});


const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },  // Add sessionId here
    conversationName: {type: String, required:false},
    userId: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
