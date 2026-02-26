import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { chatService } from "../services/chat.service";
import { circleService } from "../services/circle.service";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Initialize Socket.io with transaction namespace
 */
export function initializeSockets(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Transaction namespace for borrow request chats
  const transactionNamespace = io.of("/transaction");

  // Authentication middleware for transaction namespace
  transactionNamespace.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as JWTPayload;

      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // Transaction namespace connection handler
  transactionNamespace.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`📱 User ${socket.userId} connected to /transaction`);

    // Join a chat room (requestId)
    socket.on("join-room", async (requestId: string) => {
      try {
        // Verify user has access to this chat
        const hasAccess = await chatService.userHasAccessByRequestId(
          requestId,
          socket.userId!
        );

        if (!hasAccess) {
          socket.emit("error", { message: "Access denied to this chat" });
          return;
        }

        // Get or create chat
        const chat = await chatService.getOrCreateChat(requestId);
        
        if (!chat) {
          socket.emit("error", { message: "Failed to get or create chat" });
          return;
        }

        // Join the room
        socket.join(requestId);
        console.log(`👤 User ${socket.userId} joined room ${requestId}`);

        // Get full chat with messages
        const fullChat = await chatService.findByRequestId(requestId);

        // Send chat history to the user
        socket.emit("chat-history", {
          chatId: chat.id,
          messages: fullChat?.messages || [],
          requestId: chat.requestId,
        });

        // Notify room that user joined
        socket.to(requestId).emit("user-joined", {
          userId: socket.userId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join chat room" });
      }
    });

    // Leave a chat room
    socket.on("leave-room", (requestId: string) => {
      socket.leave(requestId);
      console.log(`👤 User ${socket.userId} left room ${requestId}`);

      socket.to(requestId).emit("user-left", {
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Send a message
    socket.on("send-message", async (data: { requestId: string; content: string }) => {
      try {
        const { requestId, content } = data;

        if (!content || !content.trim()) {
          socket.emit("error", { message: "Message content is required" });
          return;
        }

        // Verify user has access
        const hasAccess = await chatService.userHasAccessByRequestId(
          requestId,
          socket.userId!
        );

        if (!hasAccess) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        // Get or create chat
        const chat = await chatService.getOrCreateChat(requestId);

        if (!chat) {
          socket.emit("error", { message: "Failed to get chat" });
          return;
        }

        // Save message to database
        const message = await chatService.sendMessage(
          chat.id,
          socket.userId!,
          content.trim()
        );

        // Broadcast message to all users in the room
        transactionNamespace.to(requestId).emit("new-message", {
          id: message.id,
          chatId: message.chatId,
          senderId: message.senderId,
          senderName: message.sender.name,
          content: message.content,
          createdAt: message.createdAt,
        });

        console.log(`💬 Message sent in room ${requestId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing-start", (requestId: string) => {
      socket.to(requestId).emit("user-typing", {
        userId: socket.userId,
        isTyping: true,
      });
    });

    socket.on("typing-stop", (requestId: string) => {
      socket.to(requestId).emit("user-typing", {
        userId: socket.userId,
        isTyping: false,
      });
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      console.log(`📴 User ${socket.userId} disconnected from /transaction`);
    });
  });

  // Circle namespace for reading circle group chats
  const circleNamespace = io.of("/circle");

  // Authentication middleware for circle namespace
  circleNamespace.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as JWTPayload;

      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // Circle namespace connection handler
  circleNamespace.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`📚 User ${socket.userId} connected to /circle`);

    // Join a circle room
    socket.on("join-room", async (circleId: string) => {
      try {
        // Verify user is a member of this circle
        const isMember = await circleService.isMember(circleId, socket.userId!);

        if (!isMember) {
          socket.emit("error", { message: "You are not a member of this circle" });
          return;
        }

        // Get circle details
        const circle = await circleService.findById(circleId);

        if (!circle) {
          socket.emit("error", { message: "Circle not found" });
          return;
        }

        // Join the room
        socket.join(circleId);
        console.log(`👤 User ${socket.userId} joined circle room ${circleId}`);

        // Get message history
        const messages = await circleService.getMessages(circleId);

        // Send circle info and history to the user
        socket.emit("circle-info", {
          circle: {
            id: circle.id,
            name: circle.name,
            bookId: circle.bookId,
            book: circle.book,
            members: circle.members,
            averageProgress: await circleService.getAverageProgress(circleId),
          },
          messages,
        });

        // Notify room that user joined
        socket.to(circleId).emit("user-joined", {
          userId: socket.userId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error joining circle room:", error);
        socket.emit("error", { message: "Failed to join circle room" });
      }
    });

    // Leave a circle room
    socket.on("leave-room", (circleId: string) => {
      socket.leave(circleId);
      console.log(`👤 User ${socket.userId} left circle room ${circleId}`);

      socket.to(circleId).emit("user-left", {
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Send a message to the circle
    socket.on("send-message", async (data: { circleId: string; content: string }) => {
      try {
        const { circleId, content } = data;

        if (!content || !content.trim()) {
          socket.emit("error", { message: "Message content is required" });
          return;
        }

        // Verify user is a member
        const isMember = await circleService.isMember(circleId, socket.userId!);

        if (!isMember) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        // Save message to database
        const message = await circleService.sendMessage({
          circleId,
          senderId: socket.userId!,
          content: content.trim(),
        });

        // Broadcast message to all users in the circle
        circleNamespace.to(circleId).emit("new-message", {
          id: message.id,
          circleId: message.circleId,
          senderId: message.senderId,
          senderName: message.sender.name,
          content: message.content,
          createdAt: message.createdAt,
        });

        console.log(`💬 Message sent in circle ${circleId}`);
      } catch (error) {
        console.error("Error sending circle message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Update reading progress
    socket.on("update-progress", async (data: { circleId: string; progress: number }) => {
      try {
        const { circleId, progress } = data;

        if (progress < 0 || progress > 100) {
          socket.emit("error", { message: "Progress must be between 0 and 100" });
          return;
        }

        // Update progress in database
        const member = await circleService.updateProgress(
          circleId,
          socket.userId!,
          progress
        );

        // Get new average progress
        const averageProgress = await circleService.getAverageProgress(circleId);

        // Broadcast progress update to all members
        circleNamespace.to(circleId).emit("progress-updated", {
          userId: socket.userId,
          userName: member.user.name,
          progress,
          averageProgress,
          timestamp: new Date().toISOString(),
        });

        console.log(`📊 Progress updated in circle ${circleId}: ${progress}%`);
      } catch (error) {
        console.error("Error updating progress:", error);
        socket.emit("error", { message: "Failed to update progress" });
      }
    });

    // Typing indicator
    socket.on("typing-start", (circleId: string) => {
      socket.to(circleId).emit("user-typing", {
        userId: socket.userId,
        isTyping: true,
      });
    });

    socket.on("typing-stop", (circleId: string) => {
      socket.to(circleId).emit("user-typing", {
        userId: socket.userId,
        isTyping: false,
      });
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      console.log(`📴 User ${socket.userId} disconnected from /circle`);
    });
  });

  console.log("🔌 Socket.io initialized with /transaction and /circle namespaces");

  return io;
}
