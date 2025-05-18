import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, required: true },
  content: { 
    type: mongoose.Schema.Types.Mixed, 
    required: false
  }, contentType: { type: String, required: false },
});


const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    conversationName: {type: String, required:false},
    userId: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
