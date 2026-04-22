import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToMessages, sendMessage } from '../lib/services';
import { ChatMessage, FoodListing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface ChatProps {
  listing: FoodListing;
  onClose: () => void;
}

export default function Chat({ listing, onClose }: ChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(listing.id, (msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [listing.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const text = newMessage;
    setNewMessage('');
    
    try {
      await sendMessage(listing.id, user.uid, user.displayName, text);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-600 text-white">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider">{listing.foodType}</h3>
          <p className="text-xs text-orange-100 italic">Chatting with {user?.role === 'restaurant' ? listing.ngoName : listing.restaurantName}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
               <User className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
            <p className="text-[10px]">Start the coordination</p>
          </div>
        ) : messages.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "flex flex-col max-w-[80%]",
              msg.senderId === user?.uid ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <span className="text-[9px] font-bold text-gray-400 uppercase mb-1 px-1">{msg.senderName}</span>
            <div 
              className={cn(
                "px-4 py-2 rounded-2xl text-sm shadow-sm",
                msg.senderId === user?.uid 
                  ? "bg-orange-600 text-white rounded-tr-none" 
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              )}
            >
              {msg.text}
            </div>
            <span className="text-[8px] text-gray-400 mt-1 px-1">
              {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all outline-none text-sm"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-orange-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
