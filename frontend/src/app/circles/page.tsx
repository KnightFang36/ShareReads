"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Calendar,
  MapPin,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarStack, ProgressBar, GenreTag } from "@/components/common";

// Mock reading circles data
const mockCircles = [
  {
    id: "1",
    name: "Brooklyn Book Club",
    description: "A friendly group of readers exploring contemporary fiction together.",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
    members: [
      { id: "u1", name: "Sarah J", avatar: null },
      { id: "u2", name: "Mike C", avatar: null },
      { id: "u3", name: "Emily D", avatar: null },
      { id: "u4", name: "John K", avatar: null },
      { id: "u5", name: "Lisa M", avatar: null },
      { id: "u6", name: "David R", avatar: null },
      { id: "u7", name: "Anna W", avatar: null },
    ],
    currentBook: {
      id: "b1",
      title: "The Midnight Library",
      author: "Matt Haig",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    },
    progress: 68,
    meetingSchedule: "Every Saturday, 3 PM",
    location: "Brooklyn, NY",
    genres: [{ id: "1", name: "Fiction" }, { id: "2", name: "Contemporary" }],
    isPublic: true,
  },
  {
    id: "2",
    name: "Sci-Fi Explorers",
    description: "Journey through the cosmos with fellow science fiction enthusiasts.",
    coverImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=400&fit=crop",
    members: [
      { id: "u8", name: "Alex T", avatar: null },
      { id: "u9", name: "Jordan L", avatar: null },
      { id: "u10", name: "Chris P", avatar: null },
      { id: "u11", name: "Sam N", avatar: null },
    ],
    currentBook: {
      id: "b2",
      title: "Project Hail Mary",
      author: "Andy Weir",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    },
    progress: 42,
    meetingSchedule: "Bi-weekly on Sundays",
    location: "Online",
    genres: [{ id: "3", name: "Sci-Fi" }, { id: "4", name: "Adventure" }],
    isPublic: true,
  },
  {
    id: "3",
    name: "Fantasy Realm Readers",
    description: "Dive into magical worlds and epic adventures with fantasy lovers.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=400&fit=crop",
    members: [
      { id: "u12", name: "Maya R", avatar: null },
      { id: "u13", name: "Leo H", avatar: null },
      { id: "u14", name: "Zoe K", avatar: null },
      { id: "u15", name: "Evan S", avatar: null },
      { id: "u16", name: "Isla M", avatar: null },
    ],
    currentBook: {
      id: "b3",
      title: "The Song of Achilles",
      author: "Madeline Miller",
      coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
    },
    progress: 85,
    meetingSchedule: "Every Friday, 7 PM",
    location: "Manhattan, NY",
    genres: [{ id: "5", name: "Fantasy" }, { id: "6", name: "Mythology" }],
    isPublic: false,
  },
];

export default function CirclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [circles] = useState(mockCircles);

  const filteredCircles = circles.filter(
    (circle) =>
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Reading Circles</h1>
            <p className="text-muted-foreground">
              Join a community of readers and explore books together
            </p>
          </div>
          <Button className="glow-primary w-fit">
            <Plus className="h-5 w-5 mr-2" />
            Create Circle
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reading circles..."
              className="pl-12 bg-secondary border-border/50"
            />
          </div>
          <Button variant="outline" className="border-border/50">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </motion.div>

        {/* Circles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCircles.map((circle, index) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/circles/${circle.id}`}>
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:glow-primary">
                  {/* Cover Image */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={circle.coverImage}
                      alt={circle.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    
                    {/* Public/Private Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          circle.isPublic
                            ? "bg-green-500/20 text-green-400"
                            : "bg-accent/20 text-accent"
                        }`}
                      >
                        {circle.isPublic ? "Public" : "Private"}
                      </span>
                    </div>

                    {/* Current Book Preview */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div className="w-16 h-24 rounded-lg overflow-hidden shadow-xl border-2 border-card">
                        <Image
                          src={circle.currentBook.coverImage}
                          alt={circle.currentBook.title}
                          width={64}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{circle.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {circle.description}
                    </p>

                    {/* Current Book & Progress */}
                    <div className="mb-4">
                      <p className="text-sm mb-1">
                        <span className="text-muted-foreground">Currently reading: </span>
                        <span className="font-medium">{circle.currentBook.title}</span>
                      </p>
                      <ProgressBar
                        value={circle.progress}
                        size="sm"
                        showPercentage={true}
                        variant="primary"
                      />
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {circle.genres.map((genre) => (
                        <GenreTag key={genre.id} genre={genre} size="sm" />
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {circle.meetingSchedule}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {circle.location}
                        </span>
                      </div>
                      <AvatarStack users={circle.members} maxDisplay={4} size="sm" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCircles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No circles found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or create a new circle
            </p>
            <Button className="glow-primary">
              <Plus className="h-5 w-5 mr-2" />
              Create Circle
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
