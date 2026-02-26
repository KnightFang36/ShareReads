import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All chat routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/chats
 * @desc    Get all chats for authenticated user
 * @access  Private
 */
router.get("/", chatController.getUserChats);

/**
 * @route   GET /api/chats/request/:requestId
 * @desc    Get or create chat by borrow request ID
 * @access  Private
 */
router.get("/request/:requestId", chatController.getChatByRequestId);

/**
 * @route   GET /api/chats/:id
 * @desc    Get chat by ID
 * @access  Private
 */
router.get("/:id", chatController.getChatById);

/**
 * @route   GET /api/chats/:id/messages
 * @desc    Get messages for a chat (paginated)
 * @access  Private
 */
router.get("/:id/messages", chatController.getMessages);

/**
 * @route   POST /api/chats/:id/messages
 * @desc    Send a message (REST fallback)
 * @access  Private
 */
router.post("/:id/messages", chatController.sendMessage);

export default router;
