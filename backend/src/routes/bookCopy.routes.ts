import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createBookCopy,
  getMyBookCopies,
  getBookCopyById,
  getAvailableCopies,
  updateBookCopy,
  deleteBookCopy,
} from "../controllers/bookCopy.controller";

const router = Router();

/**
 * BookCopy Routes
 * Base path: /api/copies
 */

// Get available copies of a specific book (public)
router.get("/book/:bookId/available", getAvailableCopies);

// Get single copy by ID (public)
router.get("/:id", getBookCopyById);

// Protected routes (require authentication)

// Get all book copies owned by authenticated user
router.get("/", authenticate, getMyBookCopies);

// Create a new book copy (share a book)
router.post("/", authenticate, createBookCopy);

// Update book copy (owner only)
router.put("/:id", authenticate, updateBookCopy);

// Delete book copy (owner only)
router.delete("/:id", authenticate, deleteBookCopy);

export default router;
