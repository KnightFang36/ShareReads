"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Book,
  Users,
  MapPin,
  Heart,
  Sparkles,
  MessageCircle,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar, FeatureCard, GenreTag, BookCarousel } from "@/components/common";

// Mock trending books data
const trendingBooks = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.5,
    genres: [{ id: "1", name: "Fiction" }],
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    rating: 4.8,
    genres: [{ id: "2", name: "Self-Help" }],
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    rating: 4.7,
    genres: [{ id: "3", name: "Sci-Fi" }],
  },
  {
    id: "4",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
    rating: 4.6,
    genres: [{ id: "4", name: "Fantasy" }],
  },
  {
    id: "5",
    title: "Educated",
    author: "Tara Westover",
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=450&fit=crop",
    rating: 4.4,
    genres: [{ id: "5", name: "Memoir" }],
  },
];

const genres = [
  { id: "1", name: "Fiction", count: 1240 },
  { id: "2", name: "Non-Fiction", count: 890 },
  { id: "3", name: "Sci-Fi", count: 456 },
  { id: "4", name: "Fantasy", count: 678 },
  { id: "5", name: "Mystery", count: 345 },
  { id: "6", name: "Romance", count: 567 },
  { id: "7", name: "Biography", count: 234 },
  { id: "8", name: "Self-Help", count: 432 },
];

const features = [
  {
    icon: Book,
    title: "Share Your Collection",
    description: "List your books for others to discover and borrow. Every book deserves more readers.",
  },
  {
    icon: Users,
    title: "Join Reading Circles",
    description: "Connect with local book clubs, discuss favorites, and make reading social.",
  },
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    description: "Coordinate book exchanges seamlessly with built-in messaging.",
  },
  {
    icon: MapPin,
    title: "Local Discovery",
    description: "Find books and readers in your neighborhood for easy exchanges.",
  },
  {
    icon: Shield,
    title: "Trusted Community",
    description: "Verified users, ratings, and reviews ensure safe book sharing.",
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description: "AI-powered recommendations connect you with books you'll love.",
  },
];

const stats = [
  { value: "50K+", label: "Active Readers" },
  { value: "120K+", label: "Books Shared" },
  { value: "25K+", label: "Successful Borrows" },
  { value: "500+", label: "Reading Circles" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">The future of book sharing is here</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Share Books,{" "}
              <span className="text-gradient">Connect Readers</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join a thriving community where book lovers share their collections,
              discover new reads, and build meaningful connections.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <SearchBar
                size="lg"
                placeholder="Search for books, authors, or genres..."
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/books">
                <Button size="lg" className="w-full sm:w-auto glow-primary text-base px-8">
                  Browse Books
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 border-border/50 hover:border-primary">
                  Join Free
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border/30"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trending Books Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <BookCarousel
            title="Trending Now"
            subtitle="Most popular books in the community this week"
            books={trendingBooks}
          />
        </div>
      </section>

      {/* Genre Grid Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore by Genre
            </h2>
            <p className="text-lg text-muted-foreground">
              Find your next favorite read in any category
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {genres.map((genre, index) => (
              <motion.div
                key={genre.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/books?genre=${genre.id}`}>
                  <div className="group relative px-6 py-4 bg-card rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:glow-primary cursor-pointer">
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {genre.name}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({genre.count})
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">ShareReads</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to share books and connect with fellow readers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={index === 0 || index === 5}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-16 text-center"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,184,0,0.3),transparent_50%)]" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Join 50,000+ book lovers</span>
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join ShareReads today and become part of a growing community.
                Share your collection, discover new reads, and connect with readers worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-semibold text-base px-8 glow-accent"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/books">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold text-base px-8 bg-transparent border-white/30 text-white hover:bg-white/10"
                  >
                    Explore First
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
