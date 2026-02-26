"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent";
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className = "",
}: StatsCardProps) {
  const variantStyles = {
    default: {
      bg: "bg-card",
      iconBg: "bg-secondary",
      iconColor: "text-foreground",
      border: "border-border/50",
    },
    primary: {
      bg: "bg-primary/10",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
      border: "border-primary/30",
    },
    accent: {
      bg: "bg-accent/10",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
      border: "border-accent/30",
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`${styles.bg} border ${styles.border} rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold"
          >
            {value}
          </motion.p>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
