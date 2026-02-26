"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  isOwn?: boolean;
  showAvatar?: boolean;
  className?: string;
}

export function ChatBubble({
  message,
  timestamp,
  sender,
  isOwn = false,
  showAvatar = true,
  className = "",
}: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""} ${className}`}
    >
      {/* Avatar */}
      {showAvatar && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-secondary">
          {sender.avatar ? (
            <Image
              src={sender.avatar}
              alt={sender.name}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
              {sender.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Message */}
      <div
        className={`max-w-[70%] ${showAvatar ? "" : isOwn ? "mr-10" : "ml-10"}`}
      >
        {!isOwn && showAvatar && (
          <span className="text-xs text-muted-foreground ml-1 mb-1 block">
            {sender.name}
          </span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? "bg-primary text-white rounded-br-sm"
              : "bg-card border border-border/50 text-foreground rounded-bl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        <span
          className={`text-xs text-muted-foreground mt-1 block ${
            isOwn ? "text-right mr-1" : "ml-1"
          }`}
        >
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
}
