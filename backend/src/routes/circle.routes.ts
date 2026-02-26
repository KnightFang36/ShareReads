import { Router } from "express";
import { circleController } from "../controllers/circle.controller";
import { authenticate, optionalAuth } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route   GET /api/circles
 * @desc    Get all circles (paginated)
 * @access  Public (with optional auth)
 */
router.get("/", optionalAuth, circleController.getAll);

/**
 * @route   GET /api/circles/my
 * @desc    Get circles user is a member of
 * @access  Private
 */
router.get("/my", authenticate, circleController.getMyCircles);

/**
 * @route   GET /api/circles/:id
 * @desc    Get circle by ID
 * @access  Public
 */
router.get("/:id", circleController.getById);

/**
 * @route   POST /api/circles
 * @desc    Create a new reading circle
 * @access  Private
 */
router.post("/", authenticate, circleController.create);

/**
 * @route   POST /api/circles/:id/join
 * @desc    Join a circle
 * @access  Private
 */
router.post("/:id/join", authenticate, circleController.join);

/**
 * @route   POST /api/circles/:id/leave
 * @desc    Leave a circle
 * @access  Private
 */
router.post("/:id/leave", authenticate, circleController.leave);

/**
 * @route   PUT /api/circles/:id/progress
 * @desc    Update reading progress
 * @access  Private
 */
router.put("/:id/progress", authenticate, circleController.updateProgress);

/**
 * @route   GET /api/circles/:id/messages
 * @desc    Get circle messages (paginated)
 * @access  Private
 */
router.get("/:id/messages", authenticate, circleController.getMessages);

/**
 * @route   POST /api/circles/:id/messages
 * @desc    Send a message (REST fallback)
 * @access  Private
 */
router.post("/:id/messages", authenticate, circleController.sendMessage);

/**
 * @route   DELETE /api/circles/:id
 * @desc    Delete a circle
 * @access  Private
 */
router.delete("/:id", authenticate, circleController.delete);

export default router;
