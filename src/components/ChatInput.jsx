// src/components/ChatInput.jsx
import { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSend = () => {
    if (selectedFile) {
      onSendMessage({ type: "file", content: selectedFile });
      setSelectedFile(null);
    } else if (message.trim()) {
      onSendMessage({ type: "text", content: message });
      setMessage("");
    }
  };

  return (
    <div className="flex items-center p-2 bg-gray-800">
      <input type="file" onChange={handleFileChange} className="mr-2" />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message ChatGPT..."
        className="flex-grow p-2 rounded bg-gray-700 text-white outline-none"
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
