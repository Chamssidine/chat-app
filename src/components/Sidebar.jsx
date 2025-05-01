import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FaEllipsisV, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import React, { useState } from "react";


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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [newChatName, setNewChatName] = useState("");

  const inputRef = React.useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const inputRefs =  React.useRef({}); // Stocke les refs par sessionId


  // Tri décroissant par date
  const sorted = [...conversationHistory].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  // Filtre par recherche
  const filtered = sorted.filter(c =>
    (c.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRenameSubmit = (e, sessionId) => {
    e.preventDefault();
    if (newChatName.trim()) {
      onRenameChat(sessionId, newChatName);
      setEditingSessionId(null);
      setNewChatName("");
    }
  };

  return (
    // Dans JSX (diffs visuels en commentaires)
    <div
      className={`h-full bg-white border-r border-gray-200 px-4 pt-4 pb-2 flex flex-col transition-all duration-300 
+    text-sm text-gray-800
    ${isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"}
  `}
    >
      <h2 className="text-sm font-semibold mb-3 text-gray-500 tracking-wide uppercase">Historique</h2>

      {/* Recherche et ajout */}
      <div className="flex items-center mb-4 justify-between gap-2">
        {!isSearchOpen ? (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-md transition"
            aria-label="Ouvrir la recherche"
          >
            <FaSearch />
          </button>
        ) : (
          <div className="flex w-full gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Rechercher…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  setIsSearchOpen(false);
                }
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md transition"
              aria-label="Fermer la recherche"
            >
              <FaSearch />
            </button>
          </div>
        )}
        <button
          onClick={onAddChat}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          aria-label="Nouvelle conversation"
        >
          <FaPlus />
        </button>
      </div>

      {/* Liste des chats */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {filtered.map(chat => (
          <div
            key={chat.sessionId}
            className={`p-2 rounded-md flex justify-between items-center cursor-pointer group transition
          ${chat.sessionId === activeSessionId ? "bg-blue-100" : "hover:bg-gray-100"}
        `}
            onClick={() => onChatClick(chat)}
          >
            <div className="flex-1 overflow-hidden">
              <p className="truncate">
                {editingSessionId === chat.sessionId ? (
                  <input
                    ref={(el) => inputRefs.current[chat.sessionId] = el}
                    value={newChatName}
                    onChange={e => setNewChatName(e.target.value)}
                    onBlur={() => setEditingSessionId(null)}
                    onKeyDown={e => e.key === "Enter" && handleRenameSubmit(e, chat.sessionId)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                ) : (
                  chat.title?chat.title:"New Chat"
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date(chat.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
              }
              </p>

              <DropdownMenu.Root
  open={openMenuId === chat.sessionId}
  onOpenChange={(isOpen) => setOpenMenuId(isOpen ? chat.sessionId : null)}
>

                <DropdownMenu.Trigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition"
                  >
                    <FaEllipsisV size={14} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={5}
                  className="bg-white rounded-md shadow-lg border border-gray-200 text-sm overflow-hidden z-50"
                >
                  <DropdownMenu.Item
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenMenuId(null);
                      setEditingSessionId(chat.sessionId);
                      setNewChatName(chat.title);
                      setTimeout(() => {
                        inputRef.current?.focus();
                      }, 0);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  >
                    <FaEdit className="text-gray-500" /> Renommer
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={(e) => {
                      e.preventDefault();
                      onDeleteChat(chat.sessionId);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-500 cursor-pointer"
                  >
                    <FaTrash className="text-red-500" /> Supprimer
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={toggleSidebar}
        className="mt-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
      >
        Fermer
      </button>
    </div>

  );
}
