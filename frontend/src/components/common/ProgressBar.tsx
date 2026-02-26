"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "accent" | "success";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = "md",
  variant = "primary",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variantClasses = {
    primary: "bg-primary",
    accent: "bg-accent",
    success: "bg-green-500",
  };

  const glowClasses = {
    primary: "shadow-[0_0_10px_rgba(139,92,246,0.5)]",
    accent: "shadow-[0_0_10px_rgba(230,184,0,0.5)]",
    success: "shadow-[0_0_10px_rgba(34,197,94,0.5)]",
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <div
        className={`${sizeClasses[size]} w-full bg-secondary rounded-full overflow-hidden`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${variantClasses[variant]} ${glowClasses[variant]}`}
        />
      </div>
    </div>
  );
}
