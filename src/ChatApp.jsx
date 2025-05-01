import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MessageBubble from "./components/MessageBubble";
import MessageInput from "./components/MessageInput";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import React, { useReducer } from 'react';


export default function App() {

  const initialState = {
    sessions: [],
    currentSessionId: null,
  };

 

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_SESSIONS":
        //console.log(action.payload);
        return { ...state, sessions: action.payload };
      case "SET_CURRENT_SESSION":
        return { ...state, currentSessionId: action.payload };

      case "LOAD_MESSAGES":
        return { ...state, selectedsession: action.payload };
        case 'ADD_MESSAGE': {
          const updatedSessions = state.sessions.map(session =>
            session.sessionId === state.currentSessionId
              ? {
                  ...session,
                  messages: [...session.messages, action.payload]
                }
              : session
          );
          return { ...state, sessions: updatedSessions };
        }
        
    }        
  }
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const selected = state.sessions.find(s => s.sessionId === state.currentSessionId) || { messages: [] };

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [gptModel, setGptModel] = useState("gpt-4o");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const conversationHistory = state.sessions.map(session => ({
    sessionId:    session.sessionId,              // clef unique
    title:        session.conversationName    || "",          // votre nom de session
    updatedAt:    session.updatedAt || session.createdAt,
    lastMessage:  (session.messages.slice(-1)[0]?.content) || "",
  }));
  

  const loadMessages = async () => {
    if(!state.currentSessionId)return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/chat/conversation/${state.currentSessionId}`);
      const fetchedMessages = response.data;
      dispatch({ type: "LOAD_MESSAGES", payload: fetchedMessages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Call the loadMessages function
    loadMessages();
  }, [state.currentSessionId]);



  const createNewSession = (model = "gpt-4o") => {
    const newSession = {
      sessionId: uuidv4(),
      name: `Chat - ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      model,
      role: "user",
      messages: [],
    };
    const updatedSessions = [...state.sessions, newSession];
    if (updatedSessions.length > 10) {
      updatedSessions.shift();
    }
    dispatch({ type: "SET_SESSIONS", payload: updatedSessions });
    dispatch({ type: "SET_CURRENT_SESSION", payload: newSession.id });
  };


  useEffect(() => {
    if (state.sessions.length > 0 && !state.currentSessionId) {
      const last = state.sessions[state.sessions.length - 1];
      dispatch({ type: "SET_CURRENT_SESSION", payload: last.sessionId });
    }
  }, [state.sessions]);

  useEffect(() => {
    if (!state.currentSessionId) return;
    loadMessages();
  }, [state.currentSessionId]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/chat/conversation/fetch');
      if(response.data.sessions.length === 0)
      {
        createNewSession();
      } else{

        dispatch({ type: 'SET_SESSIONS', payload: response.data.sessions });
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);


  const handleChatClick = async (chat) => {
    console.log(chat);
    dispatch({ type: "SET_CURRENT_SESSION", payload: chat.sessionId });
  };


  const onRenameChat = (sessionId, newName) => {
    // Mettre à jour la conversation dans l'état
    //console.log(sessionId)
    requestConversationRename(sessionId, newName)

  };

  const requestConversationRename = async (sessionId, newName) => {
    const payload = {
      sessionID: sessionId,
      conversationName: newName,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat/conversation/rename/",
        payload
      );
      //console.log(response);

      // If the API request is successful, update the session name in state and localStorage
      const updatedSessions = state.sessions.map((session) =>
        session.id === sessionId ? { ...session, name: newName } : session
      );
      dispatch({ type: "SET_SESSIONS", payload: updatedSessions }); // Update state
      window.location.reload(); 
    } catch (err) {
      alert(err);
    }
  };




  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected.messages]);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleImageSelect = (imageData) => {
    setImage(imageData);
  };

  const handleDeleteChat = (sessionId) => {
    // Supprimer la session du tableau
    console.log("delete on ",sessionId)
    const updatedSessions = state.sessions.filter((session) => session.id !== sessionId);
    dispatch({ type: "SET_SESSIONS", payload: updatedSessions });
    deleteConversation(sessionId)
    fetchConversations()
    window.location.reload(); 
  };

  const deleteConversation = async (sessionId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/chat/conversation/delete/${sessionId}`);
      console.log('Conversation deleted:', response.data.message);
    } catch (error) {
      console.error('Error deleting conversation:', error.response?.data?.message || error.message);
    }
  };

  const handleAddChat = () => {
    // Ajouter une nouvelle conversation
    createNewSession(); // Utilise la fonction que tu as déjà pour créer une nouvelle session
  };
  const sendMessage = async (text) => {
    if (!text.trim() && !image) return;
  
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
    // 1. Ajoute directement le message utilisateur
    const userMessage = {
      _id: Date.now(),  // utilise bien _id ici, pas juste id
      role: "user",
      content: text.trim(),
      timestamp,
      image: image,
    };
  
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
  
    setMessage("");
    setFile(null);
    setImage(null);
  
    try {
      // 2. Envoie à ton serveur
      const payload = {
        message: text.trim(),
        model: gptModel,
        role: "user",
        sessionId: state.currentSessionId,
        image: image,
        userId: "id_123",
      };
  
      const response = await axios.post("http://localhost:3000/api/chat", payload);
  
      // 3. Ajoute directement le message du bot
      const botMessage = {
        _id: Date.now() + 1, // génère un autre id temporaire (ou récupère si le serveur te renvoie l'ID)
        role: "assistant",
        content: gptModel === "dall-e-3" ? "Here is your generated image:" : response.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        imageUrl: gptModel === "dall-e-3" ? response.data.reply : response.data.imageUrl,
      };
  
      fetchConversations();
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
  
  console.log(selected);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        conversationHistory={conversationHistory}
        onChatClick={handleChatClick}
        onDeleteChat={handleDeleteChat}
        onAddChat={handleAddChat}
        onRenameChat={onRenameChat}
        activeSessionId={state.currentSessionId} // Passer la session active
      />


      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="p-4 bg-white shadow-md flex justify-between items-center">
          <button onClick={toggleSidebar} className="text-gray-600">
            ☰
          </button>
          <h2 className="text-lg font-semibold">Discussion</h2>

          {/* GPT Model Selector */}
          <select
            onChange={(e) => setGptModel(e.target.value)}
            value={gptModel}
            className="bg-white p-2 rounded-lg cursor-pointer transition"
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o-mini</option>
            <option value="gpt-4.1">GPT-4.1</option>
            <option value="gpt-4.1-mini">GPT-4.1-mini</option>
            <option value="gpt-4.1-nano">GPT-4.1-nano</option>
            <option value="gpt-4.5-preview">GPT-4.5-preview</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16K</option>
            <option value="dall-e-3">DALL·E 3</option>
          </select>

          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>

        {/* Chat Zone */}
        <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 w-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex-col w-full max-w-9/10">
            {selected.messages.map((msg, index) => (
              <MessageBubble
              key={msg._id || index} // <- attention : `_id` au lieu de `id`
              text={msg.role !="user" && msg.role !="assistant"?"" :msg.content}
              sender={msg.role}
              image={msg.image}
              timestamp={msg.timestamp}
              imageUrl={msg.role == "function"? msg.content: msg.imageUrl}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <MessageInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={() => sendMessage(message)}
            onImageSelect={handleImageSelect}
          />
        </div>
      </div>
    </div>
  );
}
