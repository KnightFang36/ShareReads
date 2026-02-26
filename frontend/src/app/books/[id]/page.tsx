"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  Share2,
  BookOpen,
  Calendar,
  MapPin,
  User,
  MessageCircle,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenreTag, AvatarStack, BookCarousel } from "@/components/common";

// Mock book data
const mockBook = {
  id: "1",
  title: "The Midnight Library",
  author: "Matt Haig",
  coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=900&fit=crop",
  rating: 4.5,
  totalRatings: 2847,
  description: `Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?

A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author of Reasons to Stay Alive and How To Stop Time.`,
  genres: [
    { id: "1", name: "Fiction" },
    { id: "2", name: "Fantasy" },
    { id: "3", name: "Contemporary" },
  ],
  publishedYear: 2020,
  pages: 304,
  isbn: "978-0525559474",
  language: "English",
  copies: [
    {
      id: "c1",
      owner: { id: "u1", name: "Sarah Johnson", avatar: null },
      condition: "Like New",
      location: "Brooklyn, NY",
      available: true,
    },
    {
      id: "c2",
      owner: { id: "u2", name: "Mike Chen", avatar: null },
      condition: "Good",
      location: "Manhattan, NY",
      available: true,
    },
    {
      id: "c3",
      owner: { id: "u3", name: "Emily Davis", avatar: null },
      condition: "Very Good",
      location: "Queens, NY",
      available: false,
    },
  ],
  reviews: [
    {
      id: "r1",
      user: { id: "u4", name: "Alex Turner", avatar: null },
      rating: 5,
      text: "A beautiful exploration of life's possibilities. The concept is unique and the execution is flawless.",
      date: "2024-01-15",
    },
    {
      id: "r2",
      user: { id: "u5", name: "Jessica Lee", avatar: null },
      rating: 4,
      text: "Thought-provoking and emotional. Made me think about my own choices differently.",
      date: "2024-01-10",
    },
  ],
};

const relatedBooks = [
  {
    id: "2",
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    rating: 4.6,
    genres: [{ id: "2", name: "Fantasy" }],
  },
  {
    id: "3",
    title: "The House in the Cerulean Sea",
    author: "TJ Klune",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    rating: 4.7,
    genres: [{ id: "2", name: "Fantasy" }],
  },
  {
    id: "4",
    title: "Circe",
    author: "Madeline Miller",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
    rating: 4.5,
    genres: [{ id: "2", name: "Fantasy" }],
  },
];

export default function BookDetailPage() {
  const params = useParams();
  const [liked, setLiked] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState<string | null>(null);

  const book = mockBook; // In real app, fetch by params.id

  const availableCopies = book.copies.filter((c) => c.available);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <Link href="/books" className="hover:text-foreground transition-colors">
            Books
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{book.title}</span>
        </motion.nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Book Cover & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              {/* Cover Image */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-secondary mb-6">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLiked(!liked)}
                  className={`flex-shrink-0 ${liked ? "text-red-500 border-red-500/50" : ""}`}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button className="flex-1 glow-primary">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Request to Borrow
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Title & Author */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(book.rating)
                        ? "text-accent fill-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{book.rating}</span>
              <span className="text-muted-foreground">
                ({book.totalRatings.toLocaleString()} ratings)
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-8">
              {book.genres.map((genre) => (
                <GenreTag key={genre.id} genre={genre} size="md" />
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="bg-secondary/50 p-1">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="copies">
                  Available Copies ({availableCopies.length})
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({book.reviews.length})
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card rounded-xl p-4 border border-border/50">
                    <BookOpen className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Pages</p>
                    <p className="font-semibold">{book.pages}</p>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-border/50">
                    <Calendar className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="font-semibold">{book.publishedYear}</p>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-border/50">
                    <span className="text-primary font-bold text-lg">EN</span>
                    <p className="text-sm text-muted-foreground mt-1">Language</p>
                    <p className="font-semibold">{book.language}</p>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-border/50">
                    <span className="text-primary font-mono text-xs">ISBN</span>
                    <p className="text-sm text-muted-foreground mt-1">ISBN</p>
                    <p className="font-semibold text-sm">{book.isbn}</p>
                  </div>
                </div>
              </TabsContent>

              {/* Copies Tab */}
              <TabsContent value="copies" className="space-y-4">
                {book.copies.map((copy) => (
                  <motion.div
                    key={copy.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-card rounded-xl p-4 border transition-all cursor-pointer ${
                      selectedCopy === copy.id
                        ? "border-primary glow-primary"
                        : "border-border/50 hover:border-primary/50"
                    } ${!copy.available ? "opacity-60" : ""}`}
                    onClick={() => copy.available && setSelectedCopy(copy.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Owner Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                          {copy.owner.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{copy.owner.name}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {copy.location}
                            </span>
                            <span>•</span>
                            <span>{copy.condition}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {copy.available ? (
                          <>
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                              Available
                            </span>
                            {selectedCopy === copy.id && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium">
                            Borrowed
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {selectedCopy && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button className="w-full glow-primary" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send Borrow Request
                    </Button>
                  </motion.div>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                {book.reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl p-5 border border-border/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {review.user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{review.user.name}</p>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-accent fill-accent"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Related Books */}
        <section className="mt-16">
          <BookCarousel
            title="You Might Also Like"
            subtitle="Similar books from our community"
            books={relatedBooks}
          />
        </section>
      </div>
    </div>
  );
}
