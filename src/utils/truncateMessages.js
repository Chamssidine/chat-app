import { encoding_for_model } from "tiktoken";


const MODEL_NAME = "gpt-4-1106-preview";
const MAX_TOKENS = 128000;
const SAFETY_MARGIN = 1000; // Leave some room for the reply or function tokens

export const truncateMessagesToTokenLimit = (messages, maxTokens = MAX_TOKENS - SAFETY_MARGIN) => {
  const enc = encoding_for_model(MODEL_NAME);

  let tokenCount = 0;
  const truncatedMessages = [];

  // Start from the end (most recent) and work backward
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const encodedLength = enc.encode(message.content).length;

    // Check if adding this message would exceed the limit
    if (tokenCount + encodedLength > maxTokens) break;

    // Add it and update the token count
    tokenCount += encodedLength;  
    truncatedMessages.unshift(message); // Add to start since we're going backward
  }

  enc.free(); // Clean up encoder
  return truncatedMessages;
};
