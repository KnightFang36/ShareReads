"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Book as BookIcon, Star, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/types";

interface BookCardProps {
  book: Book;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <Link href={`/books/${book.id}`}>
        <Card className="overflow-hidden bg-card hover:glow-primary transition-all duration-300 border-border/50 h-full">
          <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
            {book.coverImageUrl ? (
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <BookIcon className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              by {book.author}
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="text-sm font-medium">
                  {book.averageRating?.toFixed(1) || "N/A"}
                </span>
              </div>
              {book._count?.copies !== undefined && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">{book._count.copies} copies</span>
                </div>
              )}
            </div>
            {book.genres && book.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {book.genres.slice(0, 2).map((g) => (
                  <Badge
                    key={g.genre.id}
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary border-0"
                  >
                    {g.genre.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
