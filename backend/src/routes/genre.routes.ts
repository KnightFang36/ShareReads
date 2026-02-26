import { Router } from "express";
import {
  createGenre,
  getAllGenres,
  getGenreById,
  getBooksByGenre,
  updateGenre,
  deleteGenre,
} from "../controllers/genre.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// GET /api/genres - Get all genres (public)
router.get("/", getAllGenres);

// GET /api/genres/:id - Get genre by ID (public)
router.get("/:id", getGenreById);

// GET /api/genres/:id/books - Get books by genre (public)
router.get("/:id/books", getBooksByGenre);

// POST /api/genres - Create genre (protected)
router.post("/", authenticate, createGenre);

// PUT /api/genres/:id - Update genre (protected)
router.put("/:id", authenticate, updateGenre);

// DELETE /api/genres/:id - Delete genre (protected)
router.delete("/:id", authenticate, deleteGenre);

export default router;
