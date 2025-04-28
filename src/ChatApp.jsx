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
    selectedsession: {
      id: "session-1",
      name: "Chat with John",
      createdAt: "2023-04-01T00:00:00Z",
      model: "gpt-4o",
      role: "user",
      messages: []
    }
    ,
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
        case "ADD_MESSAGE": {
          const updatedSessions = state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? { ...session, messages: [...(session.messages || []), action.payload] }
              : session
          );
        
          const updatedSelectedSession = state.selectedsession && state.selectedsession.id === state.currentSessionId
            ? {
                ...state.selectedsession,
                messages: [...(state.selectedsession.messages || []), action.payload],
              }
            : state.selectedsession;
        
          return {
            ...state,
            sessions: updatedSessions,
            selectedsession: updatedSelectedSession, // 🔥 maintenant updated aussi
          };
        }
    }        
  }


  const [state, dispatch] = useReducer(reducer, initialState);

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [gptModel, setGptModel] = useState("gpt-4o");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const conversationHistory = state.sessions.map((session) => ({
    title: session.conversationName,
    sessionId: session.sessionId,
  }));


  useEffect(() => {
    const loadMessages = async () => {
      console.log("stateID", state.currentSessionId);
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

    // Call the loadMessages function
    loadMessages();
  }, [state.currentSessionId]);



  const createNewSession = (model = "gpt-4o") => {
    const newSession = {
      id: uuidv4(),
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
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/chat/conversation/fetch');
        // console.log(response.data)
        dispatch({ type: 'SET_SESSIONS', payload: response.data.sessions });
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

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
    } catch (err) {
      alert(err);
    }
  };




  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.sessions, state.currentSessionId]);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleImageSelect = (imageData) => {
    setImage(imageData);
  };

  const handleDeleteChat = (sessionId) => {
    // Supprimer la session du tableau
    const updatedSessions = state.sessions.filter((session) => session.id !== sessionId);
    dispatch({ type: "SET_SESSIONS", payload: updatedSessions });
  };

  const handleAddChat = () => {
    // Ajouter une nouvelle conversation
    createNewSession(); // Utilise la fonction que tu as déjà pour créer une nouvelle session
  };
  const sendMessage = async (text) => {
    if (!text.trim() && !image) return;

    // Crée un nouveau message utilisateur
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text.trim(),
      sender: "user",
      timestamp,
      image: image,
    };

    // AJOUTER immédiatement le message dans l'état local
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    console.log("Selected Session After Adding Message:", state.selectedsession);
    setMessage("");
    setFile(null);
    setImage(null);

    try {
      const payload = {
        message: text ? text.trim() : "Image",
        model: gptModel,
        role: "user",
        sessionId: state.currentSessionId,
        image: image,
        userId: "id_123",
      };

      const response = await axios.post("http://localhost:3000/api/chat", payload);

      const botMessage = {
        id: Date.now() + 1000,
        role: "assistant",
        content: gptModel === "dall-e-3" ? "Here is your generated image:" : response.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        imageUrl: gptModel === "dall-e-3" ? response.data.reply : response.data.imageUrl,
      };

      // AJOUTER immédiatement aussi le message du bot
      dispatch({ type: "ADD_MESSAGE", payload: botMessage });
      console.log("Selected Session After Adding Message:", state.selectedsession);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 2000,
        role: "assistant",
        content: "Error communicating with server.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      dispatch({ type: "ADD_MESSAGE", payload: errorMessage });
    }
  };



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
            {state.selectedsession.messages.map((msg, index) => (
              <MessageBubble
              key={msg._id || index} // <- attention : `_id` au lieu de `id`
              text={msg.content}
              sender={msg.role}
              image={msg.image}
              timestamp={msg.timestamp}
              imageUrl={msg.imageUrl}
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
