"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Genre } from "@/types";
import Link from "next/link";

interface GenreTagProps {
  genre: Genre;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export function GenreTag({ genre, size = "md", clickable = true }: GenreTagProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const tag = (
    <motion.div whileHover={clickable ? { scale: 1.05 } : {}}>
      <Badge
        variant="outline"
        className={`${sizeClasses[size]} bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors cursor-pointer`}
      >
        {genre.name}
      </Badge>
    </motion.div>
  );

  if (clickable) {
    return (
      <Link href={`/books?genre=${genre.id}`}>
        {tag}
      </Link>
    );
  }

  return tag;
}
