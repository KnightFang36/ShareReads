// Routes - Define API endpoints
// Each route file will define endpoints for specific resources

import { Router } from "express";
import authRoutes from "./auth.routes";
import genreRoutes from "./genre.routes";
import bookRoutes from "./book.routes";
import bookCopyRoutes from "./bookCopy.routes";
import borrowRequestRoutes from "./borrowRequest.routes";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/genres", genreRoutes);
router.use("/books", bookRoutes);
router.use("/copies", bookCopyRoutes);
router.use("/requests", borrowRequestRoutes);

export default router;
