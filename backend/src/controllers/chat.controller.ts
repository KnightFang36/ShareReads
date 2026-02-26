import { Request, Response } from "express";
import { chatService } from "../services/chat.service";

/**
 * Chat Controller - Handle HTTP requests for chat functionality
 */
export const chatController = {
  /**
   * Get all chats for the authenticated user
   * GET /api/chats
   */
  async getUserChats(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const chats = await chatService.findByUserId(userId);

      res.json({
        success: true,
        data: chats,
      });
    } catch (error) {
      console.error("Error fetching user chats:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch chats",
      });
    }
  },

  /**
   * Get chat by request ID
   * GET /api/chats/request/:requestId
   */
  async getChatByRequestId(req: Request<{ requestId: string }>, res: Response) {
    try {
      const { requestId } = req.params;
      const userId = (req as any).userId;

      // Check access
      const hasAccess = await chatService.userHasAccessByRequestId(requestId, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: "Access denied to this chat",
        });
      }

      // Get or create chat
      const chat = await chatService.getOrCreateChat(requestId);

      res.json({
        success: true,
        data: chat,
      });
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch chat",
      });
    }
  },

  /**
   * Get chat by ID
   * GET /api/chats/:id
   */
  async getChatById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const chat = await chatService.findById(id);

      if (!chat) {
        return res.status(404).json({
          success: false,
          error: "Chat not found",
        });
      }

      // Check access
      const hasAccess = await chatService.userHasAccess(id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: "Access denied to this chat",
        });
      }

      res.json({
        success: true,
        data: chat,
      });
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch chat",
      });
    }
  },

  /**
   * Get messages for a chat (paginated)
   * GET /api/chats/:id/messages
   */
  async getMessages(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      // Check access
      const hasAccess = await chatService.userHasAccess(id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: "Access denied to this chat",
        });
      }

      const result = await chatService.getMessages(id, page, limit);

      res.json({
        success: true,
        data: result.messages,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch messages",
      });
    }
  },

  /**
   * Send a message (REST fallback, primarily use Socket.io)
   * POST /api/chats/:id/messages
   */
  async sendMessage(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({
          success: false,
          error: "Message content is required",
        });
      }

      // Check access
      const hasAccess = await chatService.userHasAccess(id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: "Access denied to this chat",
        });
      }

      const message = await chatService.sendMessage(id, userId, content.trim());

      // Emit to socket if available
      const io = req.app.get("io");
      if (io) {
        const chat = await chatService.findById(id);
        if (chat) {
          io.of("/transaction").to(chat.requestId).emit("new-message", {
            id: message.id,
            chatId: message.chatId,
            senderId: message.senderId,
            senderName: message.sender.name,
            content: message.content,
            createdAt: message.createdAt,
          });
        }
      }

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({
        success: false,
        error: "Failed to send message",
      });
    }
  },
};
