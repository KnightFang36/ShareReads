"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Star,
  Calendar,
  MapPin,
  Edit,
  Settings,
  Share2,
  BookMarked,
  Heart,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard, BookGrid, ProgressBar, GenreTag } from "@/components/common";

// Mock user data
const mockUser = {
  id: "me",
  name: "Alex Thompson",
  username: "@alexreads",
  email: "alex@example.com",
  avatar: null,
  bio: "Avid reader and book collector. Love exploring different genres, from classic literature to contemporary fiction. Always looking for my next great read!",
  location: "Brooklyn, NY",
  joinedDate: "2023-06-15",
  stats: {
    booksShared: 24,
    booksRead: 87,
    circlesJoined: 3,
    borrowsCompleted: 45,
    rating: 4.8,
    reviewsWritten: 32,
  },
  favoriteGenres: [
    { id: "1", name: "Fiction" },
    { id: "2", name: "Fantasy" },
    { id: "3", name: "Sci-Fi" },
    { id: "4", name: "Mystery" },
    { id: "5", name: "Biography" },
  ],
  readingGoal: {
    current: 12,
    target: 24,
    year: 2024,
  },
};

const myBooks = [
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
];

const borrowedBooks = [
  {
    id: "4",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
    rating: 4.6,
    genres: [{ id: "2", name: "Fantasy" }],
    dueDate: "2024-02-15",
    owner: "Sarah Johnson",
  },
];

const recentActivity = [
  {
    id: "a1",
    type: "borrow",
    message: "Borrowed 'The Song of Achilles' from Sarah Johnson",
    timestamp: "2 days ago",
  },
  {
    id: "a2",
    type: "share",
    message: "Added 'Project Hail Mary' to your collection",
    timestamp: "1 week ago",
  },
  {
    id: "a3",
    type: "review",
    message: "Wrote a review for 'The Midnight Library'",
    timestamp: "2 weeks ago",
  },
  {
    id: "a4",
    type: "circle",
    message: "Joined 'Brooklyn Book Club'",
    timestamp: "3 weeks ago",
  },
];

export default function ProfilePage() {
  const user = mockUser;

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                  <p className="text-muted-foreground mb-4">{user.username}</p>
                  <p className="text-foreground/80 max-w-xl mb-4">{user.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(user.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      {user.stats.rating} rating
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button className="glow-primary">
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            title="Books Shared"
            value={user.stats.booksShared}
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Books Read"
            value={user.stats.booksRead}
            icon={BookMarked}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Circles Joined"
            value={user.stats.circlesJoined}
            icon={Users}
          />
          <StatsCard
            title="Borrows Completed"
            value={user.stats.borrowsCompleted}
            icon={Heart}
            variant="accent"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="collection" className="space-y-6">
              <TabsList className="bg-secondary/50 p-1">
                <TabsTrigger value="collection">My Collection</TabsTrigger>
                <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Collection Tab */}
              <TabsContent value="collection">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {myBooks.length} books in your collection
                  </h3>
                  <Button variant="outline" size="sm">
                    Add Book
                  </Button>
                </div>
                <BookGrid books={myBooks} />
              </TabsContent>

              {/* Borrowed Tab */}
              <TabsContent value="borrowed">
                {borrowedBooks.length > 0 ? (
                  <div className="space-y-4">
                    {borrowedBooks.map((book) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl border border-border/50 p-4"
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={book.coverImage}
                              alt={book.title}
                              width={64}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <Link href={`/books/${book.id}`}>
                              <h4 className="font-semibold hover:text-primary transition-colors">
                                {book.title}
                              </h4>
                            </Link>
                            <p className="text-muted-foreground text-sm mb-2">
                              by {book.author}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                From: {book.owner}
                              </span>
                              <span className="flex items-center gap-1 text-accent">
                                <Clock className="h-4 w-4" />
                                Due: {new Date(book.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Return
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No borrowed books</p>
                  </div>
                )}
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/50"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === "borrow"
                            ? "bg-primary/20 text-primary"
                            : activity.type === "share"
                            ? "bg-green-500/20 text-green-500"
                            : activity.type === "review"
                            ? "bg-accent/20 text-accent"
                            : "bg-blue-500/20 text-blue-500"
                        }`}
                      >
                        {activity.type === "borrow" && <BookOpen className="h-5 w-5" />}
                        {activity.type === "share" && <TrendingUp className="h-5 w-5" />}
                        {activity.type === "review" && <Star className="h-5 w-5" />}
                        {activity.type === "circle" && <Users className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reading Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-xl border border-border/50 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{user.readingGoal.year} Reading Goal</h3>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gradient">
                  {user.readingGoal.current}
                </span>
                <span className="text-2xl text-muted-foreground">
                  {" "}/ {user.readingGoal.target}
                </span>
                <p className="text-sm text-muted-foreground mt-1">books read</p>
              </div>
              <ProgressBar
                value={user.readingGoal.current}
                max={user.readingGoal.target}
                variant="accent"
                showPercentage={true}
              />
            </motion.div>

            {/* Favorite Genres */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border/50 p-5"
            >
              <h3 className="font-semibold mb-4">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {user.favoriteGenres.map((genre) => (
                  <GenreTag key={genre.id} genre={genre} size="md" />
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border/50 p-5"
            >
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-5 w-5 mr-3" />
                  Add a Book
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-5 w-5 mr-3" />
                  Create Reading Circle
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-5 w-5 mr-3" />
                  Write a Review
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
