"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Calendar,
  MapPin,
  Settings,
  Send,
  ChevronRight,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarStack, ProgressBar, ChatBubble, BookCard } from "@/components/common";

// Mock circle data
const mockCircle = {
  id: "1",
  name: "Brooklyn Book Club",
  description: "A friendly group of readers exploring contemporary fiction together. We meet every Saturday to discuss our current read and share recommendations.",
  coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
  members: [
    { id: "u1", name: "Sarah Johnson", avatar: null, role: "admin" },
    { id: "u2", name: "Mike Chen", avatar: null, role: "member" },
    { id: "u3", name: "Emily Davis", avatar: null, role: "member" },
    { id: "u4", name: "John Kim", avatar: null, role: "member" },
    { id: "u5", name: "Lisa Miller", avatar: null, role: "member" },
    { id: "u6", name: "David Ross", avatar: null, role: "member" },
    { id: "u7", name: "Anna White", avatar: null, role: "member" },
  ],
  currentBook: {
    id: "b1",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    totalPages: 304,
  },
  progress: 68,
  meetingSchedule: "Every Saturday, 3 PM",
  nextMeeting: "2024-02-03",
  location: "Brooklyn, NY",
  isPublic: true,
  isMember: true,
};

const mockMessages = [
  {
    id: "m1",
    message: "Just finished chapter 15! The twist about the library was incredible.",
    timestamp: "Yesterday, 4:30 PM",
    sender: { id: "u2", name: "Mike Chen", avatar: null },
    isOwn: false,
  },
  {
    id: "m2",
    message: "Right?! I didn't see that coming at all. Matt Haig is brilliant.",
    timestamp: "Yesterday, 4:35 PM",
    sender: { id: "u3", name: "Emily Davis", avatar: null },
    isOwn: false,
  },
  {
    id: "m3",
    message: "I'm still catching up but trying to avoid spoilers 😅",
    timestamp: "Yesterday, 5:00 PM",
    sender: { id: "me", name: "You", avatar: null },
    isOwn: true,
  },
  {
    id: "m4",
    message: "No worries! We'll discuss everything in detail at Saturday's meeting.",
    timestamp: "Yesterday, 5:05 PM",
    sender: { id: "u1", name: "Sarah Johnson", avatar: null },
    isOwn: false,
  },
];

const pastBooks = [
  {
    id: "p1",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    coverImage: "https://images.unsplash.com/photo-1509266272358-7701da638078?w=300&h=450&fit=crop",
    rating: 4.5,
    genres: [{ id: "1", name: "Fiction" }],
  },
  {
    id: "p2",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=450&fit=crop",
    rating: 4.3,
    genres: [{ id: "2", name: "Thriller" }],
  },
];

export default function CircleDetailPage() {
  const params = useParams();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const circle = mockCircle;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `m${messages.length + 1}`,
      message: newMessage,
      timestamp: "Just now",
      sender: { id: "me", name: "You", avatar: null },
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80">
        <Image
          src={circle.coverImage}
          alt={circle.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container relative -mt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{circle.name}</h1>
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
              <p className="text-muted-foreground mb-4 max-w-2xl">
                {circle.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {circle.members.length} members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {circle.meetingSchedule}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {circle.location}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              {circle.isMember ? (
                <>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button variant="outline">Leave Circle</Button>
                </>
              ) : (
                <Button className="glow-primary">Join Circle</Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="discussion" className="space-y-6">
              <TabsList className="bg-secondary/50 p-1">
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>

              {/* Discussion Tab */}
              <TabsContent value="discussion" className="space-y-4">
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  {/* Messages */}
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                      <ChatBubble
                        key={msg.id}
                        message={msg.message}
                        timestamp={msg.timestamp}
                        sender={msg.sender}
                        isOwn={msg.isOwn}
                        showAvatar={
                          index === 0 ||
                          messages[index - 1].sender.id !== msg.sender.id
                        }
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border/50">
                    <div className="flex gap-3">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Share your thoughts..."
                        className="bg-secondary border-border/50"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="glow-primary"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Books Tab */}
              <TabsContent value="books" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Currently Reading</h3>
                  <div className="bg-card rounded-xl border border-border/50 p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-36 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={circle.currentBook.coverImage}
                          alt={circle.currentBook.title}
                          width={96}
                          height={144}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/books/${circle.currentBook.id}`}>
                          <h4 className="font-semibold hover:text-primary transition-colors">
                            {circle.currentBook.title}
                          </h4>
                        </Link>
                        <p className="text-muted-foreground text-sm mb-4">
                          by {circle.currentBook.author}
                        </p>
                        <ProgressBar
                          value={circle.progress}
                          label="Group Progress"
                          variant="primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Previously Read</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {pastBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        coverImage={book.coverImage}
                        rating={book.rating}
                        genres={book.genres}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-4">
                {circle.members.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {member.role === "admin" && (
                            <Crown className="h-4 w-4 text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Meeting */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-xl border border-border/50 p-5"
            >
              <h3 className="font-semibold mb-4">Next Meeting</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {new Date(circle.nextMeeting).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">3:00 PM EST</p>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                Add to Calendar
              </Button>
            </motion.div>

            {/* Members Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border/50 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Members</h3>
                <span className="text-sm text-muted-foreground">
                  {circle.members.length} total
                </span>
              </div>
              <AvatarStack users={circle.members} maxDisplay={6} size="md" />
            </motion.div>

            {/* Current Book */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border/50 p-5"
            >
              <h3 className="font-semibold mb-4">Reading Now</h3>
              <Link href={`/books/${circle.currentBook.id}`}>
                <div className="flex items-center gap-3 group">
                  <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={circle.currentBook.coverImage}
                      alt={circle.currentBook.title}
                      width={64}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {circle.currentBook.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {circle.currentBook.author}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
