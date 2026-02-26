"use client";

import { BookCard } from "./BookCard";
import { motion } from "framer-motion";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  rating?: number;
  genres?: { id: string; name: string }[];
}

interface BookGridProps {
  books: Book[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function BookGrid({
  books,
  loading = false,
  emptyMessage = "No books found",
  className = "",
}: BookGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl overflow-hidden animate-pulse"
          >
            <div className="aspect-[2/3] bg-secondary" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-secondary rounded-full w-16" />
                <div className="h-6 bg-secondary rounded-full w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <BookCard
            id={book.id}
            title={book.title}
            author={book.author}
            coverImage={book.coverImage}
            rating={book.rating}
            genres={book.genres}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
