"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface AvatarStackProps {
  users: User[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarStack({
  users,
  maxDisplay = 5,
  size = "md",
  className = "",
}: AvatarStackProps) {
  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const overlapClasses = {
    sm: "-ml-2",
    md: "-ml-3",
    lg: "-ml-4",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {displayUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`${sizeClasses[size]} ${
              index > 0 ? overlapClasses[size] : ""
            } rounded-full border-2 border-background overflow-hidden bg-secondary flex-shrink-0 relative z-${
              10 - index
            }`}
            title={user.name}
          >
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>
        ))}
        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: displayUsers.length * 0.05 }}
            className={`${sizeClasses[size]} ${overlapClasses[size]} rounded-full border-2 border-background bg-card flex items-center justify-center text-muted-foreground font-medium flex-shrink-0`}
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>
    </div>
  );
}
