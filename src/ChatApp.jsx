import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import Sidebar from "./components/Sidebar";
import MessageBubble from "./components/MessageBubble";
import MessageInput from "./components/MessageInput";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import CVAnalyzerPage from "./components/CVAnalyzerPage.jsx";
import { AnimatePresence, motion } from "framer-motion";
import {extractJson, transformToDashboardData} from "./utils/parseUtils.js";
import { CONTENT_TYPE } from "../api/chat/constants.js";
import {validateDashboardData} from "./utils/validateJson.js";

export default function App() {
  const initialState = {
    sessions: [],
    currentSessionId: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_SESSIONS":
        return { ...state, sessions: action.payload };

      case "SET_CURRENT_SESSION":
        return { ...state, currentSessionId: action.payload };

      case "LOAD_MESSAGES": {
        const updatedSessions = state.sessions.map(session =>
            session.sessionId === state.currentSessionId
                ? { ...session, messages: action.payload }
                : session
        );
        return { ...state, sessions: updatedSessions };
      }

      case 'ADD_MESSAGE': {
        const updatedSessions = state.sessions.map(session =>
            session.sessionId === state.currentSessionId
                ? { ...session, messages: [...(session.messages || []), action.payload] }
                : session
        );
        return { ...state, sessions: updatedSessions };
      }

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const selectedSession = state.sessions.find(s => s.sessionId === state.currentSessionId) || { messages: [] };
  const filteredMessages = (selectedSession.messages || []).filter(
      message => message.contentType !== CONTENT_TYPE.JSON
  );

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [gptModel, setGptModel] = useState("gpt-4o");
  const messagesEndRef = useRef(null);
  const [activeTool, setActiveTool] = useState(null);
  const [analysisResult, setAnalysisResult] = useState([]);

  const conversationHistory = state.sessions.map(session => ({
    sessionId: session.sessionId,
    title: session.conversationName || "",
    updatedAt: session.updatedAt || session.createdAt,
    lastMessage: session.messages?.slice(-1)[0]?.content || "",
  }));

  const handleToolkitClick = () => {
    setActiveTool(prev => (prev === "cv" ? null : "cv"));
  };

  const loadMessages = useCallback(async () => {
    if (!state.currentSessionId) return;
    try {
      const { data } = await axios.get(`http://localhost:3000/api/chat/conversation/${state.currentSessionId}`);

      const sessionData = Array.isArray(data.sessions)
          ? data.sessions.find(s => s.sessionId === state.currentSessionId)
          : data;

      const fetched = sessionData?.messages || [];
      fetched.filter(msg => msg.contentType === CONTENT_TYPE.JSON);
      console.log("JSON messages found:");
      console.log(fetched.length);

      // Load regular (non-JSON) messages
      const regularMessages = fetched.filter(msg => msg.contentType !== CONTENT_TYPE.JSON);
      dispatch({ type: "LOAD_MESSAGES", payload: regularMessages });

    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  }, [state.currentSessionId]);


  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const createNewSession = (model = "gpt-4o") => {
    const newSession = {
      sessionId: uuidv4(),
      conversationName: `Chat - ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      model,
      role: "user",
      messages: [],
    };
    const updatedSessions = [...state.sessions, newSession];
    if (updatedSessions.length > 10) updatedSessions.shift();
    dispatch({ type: "SET_SESSIONS", payload: updatedSessions });
    dispatch({ type: "SET_CURRENT_SESSION", payload: newSession.sessionId });
  };

  useEffect(() => {
    if (state.sessions.length > 0 && !state.currentSessionId) {
      const last = state.sessions[state.sessions.length - 1];
      dispatch({ type: "SET_CURRENT_SESSION", payload: last.sessionId });
    }
  }, [state.sessions]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
          'http://localhost:3000/api/chat/conversation/fetch'
      );

      const data = response.data;
      const filteredMessages = [];
      const messagesWithoutJson = []
      data.sessions.forEach(session => {
        session.messages.forEach(message => {
          if (message.contentType === "json") {
            const rawObject = extractJson(message.content);
            const { valid, errors } = validateDashboardData(rawObject);
            if (!valid) {
              console.error("❌ JSON invalide :", errors);
            } else {
              const dashboardData = transformToDashboardData(rawObject);
              filteredMessages.push(dashboardData);
              console.log("✅ Dashboard prêt :", dashboardData);
            }
          } else {
            messagesWithoutJson.push(message);
          }
        });
      });
      data.sessions.messages = messagesWithoutJson;

      setAnalysisResult(filteredMessages)

      if ((response.data.sessions || []).length === 0) {
        createNewSession();
      } else {

        dispatch({ type: 'SET_SESSIONS', payload: data.sessions });
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleChatClick = chat => {
    dispatch({ type: "SET_CURRENT_SESSION", payload: chat.sessionId });
  };

  const onRenameChat = (sessionId, newName) => {
    requestConversationRename(sessionId, newName);
  };

  const requestConversationRename = async (sessionId, newName) => {
    try {
      await axios.post(
          "http://localhost:3000/api/chat/conversation/rename/",
          { sessionID: sessionId, conversationName: newName }
      );
      const updated = state.sessions.map(session =>
          session.sessionId === sessionId
              ? { ...session, conversationName: newName }
              : session
      );
      dispatch({ type: "SET_SESSIONS", payload: updated });
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteChat = sessionId => {
    const updated = state.sessions.filter(
        session => session.sessionId !== sessionId
    );
    dispatch({ type: "SET_SESSIONS", payload: updated });
    deleteConversation(sessionId);
    fetchConversations();
  };

  const deleteConversation = async sessionId => {
    try {
      const response = await axios.delete(
          `http://localhost:3000/api/chat/conversation/delete/${sessionId}`
      );
      console.log('Conversation deleted:', response.data.message);
    } catch (error) {
      console.error('Error deleting conversation:', error.response?.data?.message || error.message);
    }
  };

  const handleAddChat = () => createNewSession();

  const sendMessage = async input => {
    if (!input.text || typeof input.text !== 'string' || !input.text.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage = {
      _id: Date.now(),
      role: "user",
      content: input.text.trim(),
      timestamp,
      image: input.file?.type === "image" ? input.file.data : null,
      file: input.file?.type === "pdf" ? input.file : null,
    };
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    setMessage("");
    try {
      const payload = {
        model: gptModel,
        sessionId: state.currentSessionId,
        userId: "id_123",
        role: "user",
        message: input.text.trim(),
        image: input.file?.type === "image" ? input.file.data : null,
        file: input.file?.type === "pdf" ? input.file : null,
      };
      const response = await axios.post("http://localhost:3000/api/chat", payload);
      const data = response.data;
      if (response.data.analysis) {

        const rawObject = extractJson(response.data.analysis);
        const { valid, errors } = validateDashboardData(rawObject);
        if (!valid) {
          console.error("❌ JSON invalide :", errors);
        } else {
          const dashboardData = transformToDashboardData(rawObject);
          console.log("✅ Dashboard prêt :", dashboardData);
          setAnalysisResult( dashboardData);
        }

      }
      // Priorisiere reply.content, fallback auf message.content
      const botText =
          gptModel === "dall-e-3"
              ? "Here is your generated image:"
              : data.reply?.content ?? data.message?.content ?? "";

      const botMessage = {
        _id: Date.now() + 1,
        role: "assistant",
        content: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        imageUrl: gptModel === "dall-e-3" ? data.reply : data.imageUrl
      };

      dispatch({ type: "ADD_MESSAGE", payload: botMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        _id: Date.now() + 2,
        role: "assistant",
        content: "Error communicating with server.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      dispatch({ type: "ADD_MESSAGE", payload: errorMessage });
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredMessages]);
  console.log(analysisResult);
// In App.jsx, innerhalb der Funktion App()
// App.jsx
  return (
      <div className="flex h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <Sidebar
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onToolkitClick={handleToolkitClick}
            conversationHistory={conversationHistory}
            onChatClick={handleChatClick}
            onDeleteChat={handleDeleteChat}
            onAddChat={handleAddChat}
            onRenameChat={onRenameChat}
            activeSessionId={state.currentSessionId}
        />

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Chat Section */}
          <div className={`flex flex-col overflow-hidden ${activeTool === "cv" ? "w-2/3" : "w-full"} bg-white shadow-md rounded-l-xl`}>
            {/* Header */}
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-800 transition">
                ☰
              </button>
              <h2 className="text-xl font-bold text-gray-700">Discussion</h2>
              <div className="flex items-center gap-4">
                <select
                    onChange={e => setGptModel(e.target.value)}
                    value={gptModel}
                    className="bg-gray-100 p-2 rounded-md text-sm focus:outline-none"
                >
                  <option value="gpt-4o">gpt-4o</option>
                </select>
                <div className="w-9 h-9 rounded-full bg-gray-300" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredMessages.map((msg, idx) => (
                    <MessageBubble
                        key={msg._id || idx}
                        text={["user", "assistant"].includes(msg.role) ? msg.content : ""}
                        sender={msg.role}
                        image={msg.image}
                        timestamp={msg.timestamp}
                        imageUrl={msg.role === "function" ? msg.content : msg.imageUrl}
                    />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <MessageInput
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onSend={sendMessage}
              />
            </div>
          </div>

          {/* CV Analyzer */}
          <AnimatePresence>
            {activeTool === "cv" && (
                <motion.div
                    key="cv-analyzer"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.2 }}
                    className="w-1/3 flex flex-col bg-white border-l shadow-md rounded-r-xl overflow-auto"
                >
                  <CVAnalyzerPage
                      onUpload={data => sendMessage(data)}
                      JsonAnalysis={analysisResult}
                  />
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );


}
