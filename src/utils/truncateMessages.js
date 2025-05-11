import { encoding_for_model } from "tiktoken";


const MODEL_NAME = "gpt-4-1106-preview";
const MAX_TOKENS = 128000;
const SAFETY_MARGIN = 1000; // Leave some room for the reply or function tokens

/**
 * Trims conversation messages to only include role and content,
 * and limits the number of messages (optional).
 *
 * @param {Array} messages - Full array of message objects with extra fields.
 * @param {number} maxMessages - Optional. Number of recent messages to keep.
 * @returns {Array} Trimmed conversation array for OpenAI.
 */
export function trimConversation(messages, maxMessages = 20) {
  const trimmed = messages
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      .filter(msg => msg.role && msg.content); // Ensure valid structure

  if (trimmed.length > maxMessages) {
    return trimmed.slice(-maxMessages); // Keep only the last N messages
  }

  return trimmed;
}


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
