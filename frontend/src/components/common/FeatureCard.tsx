"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: boolean;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient = false,
  className = "",
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        relative group p-6 rounded-2xl border border-border/50
        ${gradient ? "bg-gradient-to-br from-primary/10 to-accent/10" : "bg-card"}
        hover:border-primary/50 transition-all duration-300
        ${className}
      `}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-accent/5 blur-xl" />

      <div className="relative z-10">
        <div
          className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center ${
            gradient
              ? "bg-gradient-to-br from-primary to-accent"
              : "bg-primary/20"
          }`}
        >
          <Icon className={`w-7 h-7 ${gradient ? "text-white" : "text-primary"}`} />
        </div>

        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
