"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Smile,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/common";

// Mock conversations
const mockConversations = [
  {
    id: "conv1",
    user: { id: "u1", name: "Sarah Johnson", avatar: null },
    lastMessage: "Sure! When would be a good time to meet?",
    timestamp: "2 min ago",
    unread: 2,
    book: { title: "The Midnight Library" },
  },
  {
    id: "conv2",
    user: { id: "u2", name: "Mike Chen", avatar: null },
    lastMessage: "Thanks for lending me the book!",
    timestamp: "1 hour ago",
    unread: 0,
    book: { title: "Atomic Habits" },
  },
  {
    id: "conv3",
    user: { id: "u3", name: "Emily Davis", avatar: null },
    lastMessage: "I'll return it next week",
    timestamp: "Yesterday",
    unread: 0,
    book: { title: "Project Hail Mary" },
  },
];

const mockMessages = [
  {
    id: "m1",
    message: "Hi! I saw you have 'The Midnight Library' available. Is it still up for borrowing?",
    timestamp: "10:30 AM",
    sender: { id: "me", name: "You", avatar: null },
    isOwn: true,
  },
  {
    id: "m2",
    message: "Hey! Yes, it's still available. Are you interested?",
    timestamp: "10:32 AM",
    sender: { id: "u1", name: "Sarah Johnson", avatar: null },
    isOwn: false,
  },
  {
    id: "m3",
    message: "Absolutely! I've been wanting to read it for a while. The reviews are amazing.",
    timestamp: "10:33 AM",
    sender: { id: "me", name: "You", avatar: null },
    isOwn: true,
  },
  {
    id: "m4",
    message: "It's one of my favorites! Really thought-provoking. When would you like to pick it up?",
    timestamp: "10:35 AM",
    sender: { id: "u1", name: "Sarah Johnson", avatar: null },
    isOwn: false,
  },
  {
    id: "m5",
    message: "Would this weekend work? I'm free Saturday afternoon.",
    timestamp: "10:36 AM",
    sender: { id: "me", name: "You", avatar: null },
    isOwn: true,
  },
  {
    id: "m6",
    message: "Sure! When would be a good time to meet?",
    timestamp: "10:38 AM",
    sender: { id: "u1", name: "Sarah Johnson", avatar: null },
    isOwn: false,
  },
];

export default function ChatPage() {
  const params = useParams();
  const [selectedConv, setSelectedConv] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileList, setShowMobileList] = useState(!params.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `m${messages.length + 1}`,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: { id: "me", name: "You", avatar: null },
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-background">
      {/* Conversations List */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`${
          showMobileList ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-border/50 bg-card`}
      >
        {/* List Header */}
        <div className="p-4 border-b border-border/50">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => (
            <motion.button
              key={conv.id}
              whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.05)" }}
              onClick={() => {
                setSelectedConv(conv);
                setShowMobileList(false);
              }}
              className={`w-full p-4 flex items-start gap-3 border-b border-border/30 transition-colors text-left ${
                selectedConv.id === conv.id ? "bg-primary/10" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold flex-shrink-0">
                {conv.user.name.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium truncate">{conv.user.name}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {conv.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conv.lastMessage}
                </p>
                <p className="text-xs text-primary mt-1 truncate">
                  Re: {conv.book.title}
                </p>
              </div>

              {/* Unread Badge */}
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.aside>

      {/* Chat Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${
          showMobileList ? "hidden" : "flex"
        } md:flex flex-1 flex-col`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileList(true)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
              {selectedConv.user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{selectedConv.user.name}</p>
              <p className="text-xs text-muted-foreground">
                About: {selectedConv.book.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/20">
          {/* Book Context Card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md bg-card rounded-xl p-4 border border-border/50 text-center"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Conversation about
            </p>
            <Link
              href={`/books/1`}
              className="font-semibold text-primary hover:underline"
            >
              {selectedConv.book.title}
            </Link>
          </motion.div>

          {/* Messages */}
          {messages.map((msg, index) => (
            <ChatBubble
              key={msg.id}
              message={msg.message}
              timestamp={msg.timestamp}
              sender={msg.sender}
              isOwn={msg.isOwn}
              showAvatar={
                index === 0 ||
                messages[index - 1].sender.id !== msg.sender.id
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border/50 bg-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="pr-10 bg-secondary border-border/50 focus-visible:ring-primary"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              size="icon"
              className="flex-shrink-0 glow-primary"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
