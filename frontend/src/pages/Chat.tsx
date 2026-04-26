import React, { useState } from 'react';
import { Search, Send, ArrowLeft } from 'lucide-react';
import { conversations, currentUser, users, clothes } from '../data/mockData';
export function Chat() {
  const [activeChatId, setActiveChatId] = useState<string | null>(
    conversations[0]?.id || null
  );
  const [messageInput, setMessageInput] = useState('');
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const activeChat = conversations.find((c) => c.id === activeChatId);
  const otherUserId = activeChat?.participants.find(
    (id) => id !== currentUser.id
  );
  const otherUser = users.find((u) => u.id === otherUserId);
  // Mock related item (just grabbing first item of other user for demo)
  const relatedItem = clothes.find((c) => c.ownerId === otherUserId);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessageInput('');
    // In real app, send message to backend
  };
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 h-full flex overflow-hidden">
        {/* Sidebar (List) */}
        <div
          className={`${!showListOnMobile && 'hidden md:flex'} w-full md:w-80 border-r border-warmGray-100 flex-col h-full`}>
          
          <div className="p-4 border-b border-warmGray-100">
            <h2 className="text-xl font-serif font-bold text-warmGray-900 mb-4">
              Messages
            </h2>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-warmGray-400" />
              
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-warmGray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20" />
              
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const partnerId = conv.participants.find(
                (id) => id !== currentUser.id
              );
              const partner = users.find((u) => u.id === partnerId);
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveChatId(conv.id);
                    setShowListOnMobile(false);
                  }}
                  className={`p-4 border-b border-warmGray-50 cursor-pointer transition-colors flex items-start gap-3 ${activeChatId === conv.id ? 'bg-primary-50/50' : 'hover:bg-warmGray-50'}`}>
                  
                  <img
                    src={partner?.avatar}
                    alt={partner?.name}
                    className="w-12 h-12 rounded-full" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-medium text-warmGray-900 truncate">
                        {partner?.name}
                      </h4>
                      <span className="text-xs text-warmGray-400 shrink-0 ml-2">
                        {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-warmGray-500 truncate">
                      {lastMsg.text}
                    </p>
                  </div>
                </div>);

            })}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${showListOnMobile && 'hidden md:flex'} flex-1 flex flex-col h-full bg-warmGray-50/30`}>
          
          {activeChat && otherUser ?
          <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-warmGray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                  onClick={() => setShowListOnMobile(true)}
                  className="md:hidden p-2 -ml-2 text-warmGray-500">
                  
                    <ArrowLeft size={20} />
                  </button>
                  <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-10 h-10 rounded-full" />
                
                  <div>
                    <h3 className="font-medium text-warmGray-900">
                      {otherUser.name}
                    </h3>
                    <p className="text-xs text-warmGray-500">
                      {otherUser.location}
                    </p>
                  </div>
                </div>

                {relatedItem &&
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-warmGray-50 rounded-lg border border-warmGray-100">
                    <img
                  src={relatedItem.images[0]}
                  alt="Item"
                  className="w-8 h-8 rounded object-cover" />
                
                    <span className="text-xs font-medium text-warmGray-700 truncate max-w-[100px]">
                      {relatedItem.title}
                    </span>
                  </div>
              }
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    
                      <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-white border border-warmGray-100 text-warmGray-900 rounded-tl-sm'}`}>
                      
                        <p className="text-sm">{msg.text}</p>
                        <span
                        className={`text-[10px] mt-1 block ${isMe ? 'text-primary-100' : 'text-warmGray-400'}`}>
                        
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        </span>
                      </div>
                    </div>);

              })}
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-warmGray-100">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-warmGray-50 border border-warmGray-200 rounded-full text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                
                  <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50">
                  
                    <Send size={18} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </> :

          <div className="flex-1 flex items-center justify-center text-warmGray-400">
              Select a conversation to start chatting
            </div>
          }
        </div>
      </div>
    </div>);

}