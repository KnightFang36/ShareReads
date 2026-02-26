"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Grid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar, BookGrid, GenreTag } from "@/components/common";

// Mock data
const mockBooks = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.5,
    genres: [{ id: "1", name: "Fiction" }, { id: "2", name: "Fantasy" }],
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    rating: 4.8,
    genres: [{ id: "3", name: "Self-Help" }],
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    rating: 4.7,
    genres: [{ id: "4", name: "Sci-Fi" }],
  },
  {
    id: "4",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
    rating: 4.6,
    genres: [{ id: "2", name: "Fantasy" }, { id: "5", name: "Romance" }],
  },
  {
    id: "5",
    title: "Educated",
    author: "Tara Westover",
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=450&fit=crop",
    rating: 4.4,
    genres: [{ id: "6", name: "Memoir" }],
  },
  {
    id: "6",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=450&fit=crop",
    rating: 4.3,
    genres: [{ id: "7", name: "Thriller" }, { id: "8", name: "Mystery" }],
  },
  {
    id: "7",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    coverImage: "https://images.unsplash.com/photo-1509266272358-7701da638078?w=300&h=450&fit=crop",
    rating: 4.6,
    genres: [{ id: "1", name: "Fiction" }, { id: "8", name: "Mystery" }],
  },
  {
    id: "8",
    title: "Dune",
    author: "Frank Herbert",
    coverImage: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=300&h=450&fit=crop",
    rating: 4.7,
    genres: [{ id: "4", name: "Sci-Fi" }, { id: "2", name: "Fantasy" }],
  },
];

const genres = [
  { id: "all", name: "All Genres" },
  { id: "1", name: "Fiction" },
  { id: "2", name: "Fantasy" },
  { id: "3", name: "Self-Help" },
  { id: "4", name: "Sci-Fi" },
  { id: "5", name: "Romance" },
  { id: "6", name: "Memoir" },
  { id: "7", name: "Thriller" },
  { id: "8", name: "Mystery" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "rating", label: "Highest Rated" },
  { value: "title", label: "Title A-Z" },
];

export default function BooksPage() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState(mockBooks);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Get genre from URL params
  useEffect(() => {
    const genreParam = searchParams.get("genre");
    if (genreParam) {
      setSelectedGenre(genreParam);
    }
  }, [searchParams]);

  // Filter and sort books
  useEffect(() => {
    setLoading(true);
    let filtered = [...mockBooks];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    // Filter by genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) =>
        book.genres.some((g) => g.id === selectedGenre)
      );
    }

    // Sort
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "oldest":
        filtered.reverse();
        break;
      default:
        // newest - keep original order
        break;
    }

    setTimeout(() => {
      setBooks(filtered);
      setLoading(false);
    }, 300);
  }, [searchQuery, selectedGenre, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedGenre !== "all" || sortBy !== "newest";

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">
            Discover books shared by our community of readers
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search books by title or author..."
                defaultValue={searchQuery}
                onSearch={setSearchQuery}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-border/50 ${showFilters ? "bg-primary/10 border-primary" : ""}`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-xl border border-border/50 p-6 space-y-4"
            >
              <div className="flex flex-wrap gap-4">
                {/* Genre Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-secondary border-border/50">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-secondary border-border/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-sm">
                        Search: {searchQuery}
                        <button onClick={() => setSearchQuery("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedGenre !== "all" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-sm">
                        {genres.find((g) => g.id === selectedGenre)?.name}
                        <button onClick={() => setSelectedGenre("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Quick Genre Tags */}
          <div className="flex flex-wrap gap-2">
            {genres.slice(1, 6).map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(selectedGenre === genre.id ? "all" : genre.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === genre.id
                    ? "bg-primary text-white"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-medium">{books.length}</span> books
          </p>
        </motion.div>

        {/* Book Grid */}
        <BookGrid
          books={books}
          loading={loading}
          emptyMessage={
            hasActiveFilters
              ? "No books match your filters. Try adjusting your search."
              : "No books available yet. Be the first to share!"
          }
        />
      </div>
    </div>
  );
}
