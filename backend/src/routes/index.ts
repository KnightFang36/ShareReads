// Routes - Define API endpoints
// Each route file will define endpoints for specific resources

import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

// Mount auth routes
router.use("/auth", authRoutes);

export default router;
