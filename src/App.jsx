import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const [gptModel, setGptModel] = useState("gpt-4o");
  const [file, setFile] = useState(null);

  const handleSend = async () => {
    if (message.trim() === "" && !file) return;

    const userMessage = {
      text: message.trim(),
      from: "user",
    };
    setChat([...chat, userMessage]);
    setMessage("");
    setFile(null);

    try {
      const response = await axios.post("http://localhost:3000/api/chat", {
        message: message || `Sent a file: ${file.name}`,
        model: gptModel,
      });

      const botMessage = { text: response.data.reply, from: "bot" };
      setChat((prevChat) => [...prevChat, botMessage]);
      setHistory([...history, userMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        text: "Error communicating with ChatGPT.",
        from: "bot",
      };
      setChat((prevChat) => [...prevChat, errorMessage]);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <div className="w-1/5 bg-gray-800 p-4 hidden md:flex flex-col">
        <h2 className="text-white text-lg font-bold mb-4">History</h2>
        <div className="mb-4">
          <ul className="space-y-2">
            <li className="text-white">Hello</li>
            <li className="text-white">C# hello world</li>
          </ul>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 bg-gray-900 text-white flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`p-2 mb-2 rounded-lg whitespace-pre-wrap break-words ${
                msg.from === "user" ? "bg-blue-600 self-end" : "bg-gray-700"
              }`}
            >
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={solarizedlight}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 p-3 flex items-center">
          <select
            onChange={(e) => setGptModel(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded mr-2"
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4">GPT-4</option>
            <option value="dall-e-3">DALL-E 3</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>

          <input
            type="text"
            className="flex-1 p-2 bg-gray-700 rounded-l-lg focus:outline-none text-white"
            placeholder="Message ChatGPT"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 rounded-r-lg hover:bg-blue-700 ml-1"
          >
            <AiOutlineSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
