import React, { useState } from "react";
import { FaTrash, FaPlus, FaEllipsisH, FaEdit } from "react-icons/fa";

export default function Sidebar({
  toggleSidebar,
  isSidebarOpen,
  conversationHistory,
  onChatClick,
  onDeleteChat,
  onAddChat,
  onRenameChat,
  activeSessionId,
}) {
  const [activeMenu, setActiveMenu] = useState(null); // Menu actif
  const [menuPosition, setMenuPosition] = useState({ left: 60, top: 5 }); // Position du menu
  const [newChatName, setNewChatName] = useState(""); // Nouveau nom de chat
  const [editingSessionId, setEditingSessionId] = useState(null); // Session en édition


  //console.log(conversationHistory);
  const handleMenuClick = (e, sessionId) => {

    
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
   //
   //  setMenuPosition({ left: rect.left + 15, top: rect.top + 20 });
    
   setActiveMenu(sessionId === activeMenu ? null : sessionId);
  };

  const handleRenameChange = (e) => {
 
    setNewChatName(e.target.value);
  };

  const handleRenameSubmit = (e, sessionId) => {
    // console.log(sessionId);
    // console.log(newChatName);
    e.preventDefault();
    if (newChatName.trim()) {
      onRenameChat(sessionId, newChatName);
      setEditingSessionId(null);
      setNewChatName("");

    }
  };

  return (
    <div
      className={`h-full bg-white border-r p-4 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Historique</h2>

      {/* Bouton pour ajouter une conversation */}
      <button
        onClick={onAddChat}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition mb-4"
      >
        <FaPlus />
      </button>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {conversationHistory.map((chat, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition flex justify-between items-center relative ${
              chat.sessionId === activeSessionId ? "bg-blue-100" : ""
            }`}
            onClick={() => onChatClick(chat)}
          >
            <div>
              <div className="font-semibold overflow-hidden text-ellipsis">
                {editingSessionId === chat.sessionId ? (
                  <input
                    type="text"
                    value={newChatName}
                    onChange={handleRenameChange}
                    onBlur={() => setEditingSessionId(null)} // Annule si on clique en dehors
                    className="border p-1 rounded-md"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleRenameSubmit(e, chat.sessionId);
                        setEditingSessionId(null)
                      }
                    }}
                  />
                ) : (
                  <p className="font-semibold overflow-hidden text-sm text-ellipsis" >
                    {chat.title}

                  </p>
                )}
              </div>
              <div className="text-sm text-gray-500">{chat.lastMessage}</div>
            </div>

            {/* Bouton menu */}
            <button
              onClick={(e) => handleMenuClick(e, chat.sessionId)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FaEllipsisH />
            </button>

            {/* Menu contextuel */}
            {activeMenu === chat.sessionId && (
              <div
                className="absolute z-10 bg-white shadow-lg rounded-md p-2 w-40 mt-1 border border-gray-200"
                style={{
                  left: `${menuPosition.left}px`,
                  top: `${menuPosition.top}px`,
                }}
              >
                {/* Option Renommer */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingSessionId(chat.sessionId);
                    setNewChatName(chat.title);
                    setActiveMenu(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:bg-gray-100 p-2 rounded-md flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Renommer
                </button>
                {/* Option Supprimer */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.sessionId);
                  }}
                  className="block w-full text-left text-red-500 hover:bg-gray-100 p-2 rounded-md flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={toggleSidebar}
        className="mt-4 p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
      >
        Fermer
      </button>
    </div>
  );
}
