import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createBorrowRequest,
  getMyBorrowRequests,
  getIncomingRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  markAsReturned,
  cancelRequest,
} from "../controllers/borrowRequest.controller";

const router = Router();

/**
 * BorrowRequest Routes
 * Base path: /api/requests
 * All routes require authentication
 */

// Get requests made by me (as borrower)
router.get("/my-requests", authenticate, getMyBorrowRequests);

// Get requests for my books (as owner)
router.get("/incoming", authenticate, getIncomingRequests);

// Get single request by ID
router.get("/:id", authenticate, getRequestById);

// Create a new borrow request
router.post("/", authenticate, createBorrowRequest);

// Approve a request (owner only)
router.post("/:id/approve", authenticate, approveRequest);

// Reject a request (owner only)
router.post("/:id/reject", authenticate, rejectRequest);

// Mark book as returned (owner only)
router.post("/:id/return", authenticate, markAsReturned);

// Cancel a request (borrower only)
router.post("/:id/cancel", authenticate, cancelRequest);

export default router;
