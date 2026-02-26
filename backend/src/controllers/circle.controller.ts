import { Request, Response } from "express";
import { circleService } from "../services/circle.service";

/**
 * Circle Controller - Handle HTTP requests for reading circles
 */
export const circleController = {
  /**
   * Create a new reading circle
   * POST /api/circles
   */
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { name, bookId } = req.body;

      if (!name || !bookId) {
        return res.status(400).json({
          success: false,
          error: "Name and bookId are required",
        });
      }

      const circle = await circleService.create({
        name,
        bookId,
        creatorId: userId,
      });

      res.status(201).json({
        success: true,
        data: circle,
      });
    } catch (error: any) {
      console.error("Error creating circle:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to create circle",
      });
    }
  },

  /**
   * Get all circles (paginated)
   * GET /api/circles
   */
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await circleService.findAll(page, limit);

      res.json({
        success: true,
        data: result.circles,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching circles:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch circles",
      });
    }
  },

  /**
   * Get circles user is a member of
   * GET /api/circles/my
   */
  async getMyCircles(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const circles = await circleService.findByUserId(userId);

      res.json({
        success: true,
        data: circles,
      });
    } catch (error) {
      console.error("Error fetching user circles:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch circles",
      });
    }
  },

  /**
   * Get circle by ID
   * GET /api/circles/:id
   */
  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const circle = await circleService.findById(id);

      if (!circle) {
        return res.status(404).json({
          success: false,
          error: "Circle not found",
        });
      }

      res.json({
        success: true,
        data: circle,
      });
    } catch (error) {
      console.error("Error fetching circle:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch circle",
      });
    }
  },

  /**
   * Join a circle
   * POST /api/circles/:id/join
   */
  async join(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const membership = await circleService.join(id, userId);

      res.status(201).json({
        success: true,
        data: membership,
        message: "Successfully joined the circle",
      });
    } catch (error: any) {
      console.error("Error joining circle:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to join circle",
      });
    }
  },

  /**
   * Leave a circle
   * POST /api/circles/:id/leave
   */
  async leave(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      await circleService.leave(id, userId);

      res.json({
        success: true,
        message: "Successfully left the circle",
      });
    } catch (error: any) {
      console.error("Error leaving circle:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to leave circle",
      });
    }
  },

  /**
   * Update reading progress
   * PUT /api/circles/:id/progress
   */
  async updateProgress(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const { progress } = req.body;

      if (typeof progress !== "number") {
        return res.status(400).json({
          success: false,
          error: "Progress must be a number",
        });
      }

      const member = await circleService.updateProgress(id, userId, progress);

      // Get average progress for the circle
      const averageProgress = await circleService.getAverageProgress(id);

      res.json({
        success: true,
        data: {
          member,
          averageProgress,
        },
      });
    } catch (error: any) {
      console.error("Error updating progress:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to update progress",
      });
    }
  },

  /**
   * Get circle messages (paginated)
   * GET /api/circles/:id/messages
   */
  async getMessages(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await circleService.getMessages(id, page, limit);

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
   * Send a message (REST fallback)
   * POST /api/circles/:id/messages
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

      const message = await circleService.sendMessage({
        circleId: id,
        senderId: userId,
        content: content.trim(),
      });

      // Emit to socket if available
      const io = req.app.get("io");
      if (io) {
        io.of("/circle").to(id).emit("new-message", {
          id: message.id,
          circleId: message.circleId,
          senderId: message.senderId,
          senderName: message.sender.name,
          content: message.content,
          createdAt: message.createdAt,
        });
      }

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to send message",
      });
    }
  },

  /**
   * Delete a circle (creator only)
   * DELETE /api/circles/:id
   */
  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;

      await circleService.delete(id);

      res.json({
        success: true,
        message: "Circle deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting circle:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete circle",
      });
    }
  },
};
