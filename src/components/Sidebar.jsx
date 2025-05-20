import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FaEllipsisV, FaSearch, FaPlus, FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa';
import React, { useState } from "react";

export default function Sidebar({
                                  toggleSidebar,
                                  isSidebarOpen,
                                  conversationHistory,
                                  onChatClick,
                                  onDeleteChat,
                                  onAddChat,
                                  onRenameChat,
                                  onToolkitClick,
                                  activeSessionId,
                                }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [newChatName, setNewChatName] = useState("");

  const inputRef = React.useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const inputRefs = React.useRef({});

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
      <div
          className={`h-full bg-white border-r border-gray-200 px-4 pt-6 pb-4 flex flex-col text-sm text-gray-800 transition-all duration-300 ${
              isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"
          }`}
      >
          {/* Titre */}
          <h2 className="text-xs font-bold mb-4 text-slate-500 uppercase tracking-widest">
              Historique
          </h2>

          {/* Recherche + bouton nouveau chat */}
          <div className="flex items-center mb-4 gap-2">
              {isSearchOpen ? (
                  <div className="flex w-full gap-2">
                      <input
                          type="text"
                          placeholder="Rechercher…"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && setIsSearchOpen(false)}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      />
                      <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-indigo-500 transition">
                          <FaSearch />
                      </button>
                  </div>
              ) : (
                  <button onClick={() => setIsSearchOpen(true)} className="text-gray-500 hover:text-indigo-500 transition">
                      <FaSearch />
                  </button>
              )}
              <button
                  onClick={onAddChat}
                  className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              >
                  <FaPlus />
              </button>
          </div>

          {/* Liste des chats */}
          <div className="flex-1 overflow-y-auto space-y-1">
              {filtered.map(chat => (
                  <div
                      key={chat.sessionId}
                      onClick={() => onChatClick(chat)}
                      className={`p-2 rounded-lg flex justify-between items-center cursor-pointer group transition ${
                          chat.sessionId === activeSessionId ? "bg-indigo-100" : "hover:bg-gray-100"
                      }`}
                  >
                      <div className="flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium text-gray-700">
                              {editingSessionId === chat.sessionId ? (
                                  <input
                                      ref={el => (inputRefs.current[chat.sessionId] = el)}
                                      value={newChatName}
                                      onChange={e => setNewChatName(e.target.value)}
                                      onBlur={() => setEditingSessionId(null)}
                                      onKeyDown={e => e.key === "Enter" && handleRenameSubmit(e, chat.sessionId)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  />
                              ) : (
                                  chat.title || "Nouvelle conversation"
                              )}
                          </p>
                      </div>

                      {/* Heure + Menu */}
                      <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400 hidden sm:block">
                              {new Date(chat.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <DropdownMenu.Root open={openMenuId === chat.sessionId} onOpenChange={isOpen => setOpenMenuId(isOpen ? chat.sessionId : null)}>
                              <DropdownMenu.Trigger asChild>
                                  <button onClick={e => e.stopPropagation()} className="text-gray-500 hover:text-indigo-600">
                                      <FaEllipsisV size={14} />
                                  </button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Content className="bg-white rounded-lg shadow-md border border-gray-100">
                                  <DropdownMenu.Item onSelect={e => { e.preventDefault(); setOpenMenuId(null); setEditingSessionId(chat.sessionId); setNewChatName(chat.title); setTimeout(() => inputRef.current?.focus(), 0); }}
                                                     className="px-4 py-2 hover:bg-gray-100 text-sm"
                                  >
                                      <FaEdit className="inline mr-2" /> Renommer
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Item onSelect={e => { e.preventDefault(); onDeleteChat(chat.sessionId); }}
                                                     className="px-4 py-2 hover:bg-red-100 text-sm text-red-500"
                                  >
                                      <FaTrash className="inline mr-2" /> Supprimer
                                  </DropdownMenu.Item>
                              </DropdownMenu.Content>
                          </DropdownMenu.Root>
                      </div>
                  </div>
              ))}
          </div>

          {/* Toolkit */}
          <div className="mt-6">
              <h2 className="text-xs font-bold mb-2 text-slate-500 uppercase tracking-widest">Toolkit</h2>
              <button
                  onClick={() => onToolkitClick('cvAnalyzer')}
                  className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              >
                  <FaFilePdf className="mr-2" /> Analyse de CV
              </button>
          </div>

          {/* Fermer */}
          <button
              onClick={toggleSidebar}
              className="mt-4 py-2 px-3 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
          >
              Fermer
          </button>
      </div>

  );
}
