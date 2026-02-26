import { Request, Response } from "express";
import { bookCopyService } from "../services/bookCopy.service";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * BookCopy Controller - Handle book copy (sharing) operations
 */

// Create a new book copy (user shares a book they own)
export const createBookCopy = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, condition, location } = req.body;
    const ownerId = req.user!.userId;

    if (!bookId || !condition) {
      return res.status(400).json({
        success: false,
        message: "Book ID and condition are required",
      });
    }

    // Validate condition enum
    const validConditions = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"];
    if (!validConditions.includes(condition)) {
      return res.status(400).json({
        success: false,
        message: "Invalid condition. Must be: NEW, LIKE_NEW, GOOD, FAIR, or POOR",
      });
    }

    const bookCopy = await bookCopyService.create({
      bookId,
      ownerId,
      condition,
      location: location || "",
    });

    res.status(201).json({
      success: true,
      message: "Book copy added successfully",
      data: { bookCopy },
    });
  } catch (error: any) {
    console.error("Create book copy error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create book copy",
    });
  }
};

// Get all book copies owned by authenticated user
export const getMyBookCopies = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user!.userId;
    const copies = await bookCopyService.findByOwnerId(ownerId);

    res.json({
      success: true,
      data: { copies },
    });
  } catch (error: any) {
    console.error("Get my book copies error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book copies",
    });
  }
};

// Get book copy by ID
export const getBookCopyById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const bookCopy = await bookCopyService.findById(id);

    if (!bookCopy) {
      return res.status(404).json({
        success: false,
        message: "Book copy not found",
      });
    }

    res.json({
      success: true,
      data: { bookCopy },
    });
  } catch (error: any) {
    console.error("Get book copy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book copy",
    });
  }
};

// Get available copies of a specific book
export const getAvailableCopies = async (req: Request<{ bookId: string }>, res: Response) => {
  try {
    const { bookId } = req.params;
    const copies = await bookCopyService.findAvailableByBookId(bookId);

    res.json({
      success: true,
      data: { copies },
    });
  } catch (error: any) {
    console.error("Get available copies error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available copies",
    });
  }
};

// Update book copy (owner only)
export const updateBookCopy = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { condition, location, availabilityStatus } = req.body;
    const userId = req.user!.userId;

    // Check ownership
    const existingCopy = await bookCopyService.findById(id);
    if (!existingCopy) {
      return res.status(404).json({
        success: false,
        message: "Book copy not found",
      });
    }

    if (existingCopy.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this book copy",
      });
    }

    const updateData: any = {};
    if (condition) updateData.condition = condition;
    if (location !== undefined) updateData.location = location;
    if (availabilityStatus) updateData.availabilityStatus = availabilityStatus;

    const bookCopy = await bookCopyService.update(id, updateData);

    res.json({
      success: true,
      message: "Book copy updated successfully",
      data: { bookCopy },
    });
  } catch (error: any) {
    console.error("Update book copy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update book copy",
    });
  }
};

// Delete book copy (owner only)
export const deleteBookCopy = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    // Check ownership
    const existingCopy = await bookCopyService.findById(id);
    if (!existingCopy) {
      return res.status(404).json({
        success: false,
        message: "Book copy not found",
      });
    }

    if (existingCopy.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this book copy",
      });
    }

    // Don't allow deletion if currently borrowed
    if (existingCopy.availabilityStatus === "BORROWED") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a book copy that is currently borrowed",
      });
    }

    await bookCopyService.delete(id);

    res.json({
      success: true,
      message: "Book copy deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete book copy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete book copy",
    });
  }
};
