import { Router } from "express";
import {
  createBook,
  getAllBooks,
  searchBooks,
  getBookById,
  updateBook,
  addGenresToBook,
  removeGenreFromBook,
  deleteBook,
} from "../controllers/book.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// GET /api/books - Get all books (public)
router.get("/", getAllBooks);

// GET /api/books/search - Search books (public)
router.get("/search", searchBooks);

// GET /api/books/:id - Get book by ID (public)
router.get("/:id", getBookById);

// POST /api/books - Create book (protected)
router.post("/", authenticate, createBook);

// PUT /api/books/:id - Update book (protected)
router.put("/:id", authenticate, updateBook);

// POST /api/books/:id/genres - Add genres to book (protected)
router.post("/:id/genres", authenticate, addGenresToBook);

// DELETE /api/books/:id/genres/:genreId - Remove genre from book (protected)
router.delete("/:id/genres/:genreId", authenticate, removeGenreFromBook);

// DELETE /api/books/:id - Delete book (protected)
router.delete("/:id", authenticate, deleteBook);

export default router;
