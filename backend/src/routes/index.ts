// Routes - Define API endpoints
// Each route file will define endpoints for specific resources

import { Router } from "express";
import authRoutes from "./auth.routes";
import genreRoutes from "./genre.routes";
import bookRoutes from "./book.routes";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/genres", genreRoutes);
router.use("/books", bookRoutes);

export default router;
