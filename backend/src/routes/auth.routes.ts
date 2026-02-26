import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Login a user
router.post("/login", login);

// GET /api/auth/me - Get current user (protected)
router.get("/me", authenticate, getMe);

export default router;
