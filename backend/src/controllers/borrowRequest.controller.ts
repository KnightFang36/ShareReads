import { Request, Response } from "express";
import { borrowRequestService } from "../services/borrowRequest.service";
import { bookCopyService } from "../services/bookCopy.service";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * BorrowRequest Controller - Handle borrow request workflow
 */

// Create a new borrow request
export const createBorrowRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { bookCopyId } = req.body;
    const borrowerId = req.user!.userId;

    if (!bookCopyId) {
      return res.status(400).json({
        success: false,
        message: "Book copy ID is required",
      });
    }

    // Check if book copy exists and is available
    const bookCopy = await bookCopyService.findById(bookCopyId);
    if (!bookCopy) {
      return res.status(404).json({
        success: false,
        message: "Book copy not found",
      });
    }

    // Can't borrow your own book
    if (bookCopy.ownerId === borrowerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot borrow your own book",
      });
    }

    // Check availability
    if (bookCopy.availabilityStatus !== "AVAILABLE") {
      return res.status(400).json({
        success: false,
        message: "This book copy is not available for borrowing",
      });
    }

    const request = await borrowRequestService.create({
      bookCopyId,
      borrowerId,
    });

    res.status(201).json({
      success: true,
      message: "Borrow request created successfully",
      data: { request },
    });
  } catch (error: any) {
    console.error("Create borrow request error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create borrow request",
    });
  }
};

// Get requests made by authenticated user (as borrower)
export const getMyBorrowRequests = async (req: AuthRequest, res: Response) => {
  try {
    const borrowerId = req.user!.userId;
    const requests = await borrowRequestService.findByBorrowerId(borrowerId);

    res.json({
      success: true,
      data: { requests },
    });
  } catch (error: any) {
    console.error("Get my borrow requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrow requests",
    });
  }
};

// Get requests for books owned by authenticated user (as owner)
export const getIncomingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user!.userId;
    const requests = await borrowRequestService.findForOwner(ownerId);

    res.json({
      success: true,
      data: { requests },
    });
  } catch (error: any) {
    console.error("Get incoming requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch incoming requests",
    });
  }
};

// Get single borrow request by ID
export const getRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const request = await borrowRequestService.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Borrow request not found",
      });
    }

    // Only owner or borrower can view the request
    const isOwner = request.bookCopy.ownerId === userId;
    const isBorrower = request.borrowerId === userId;

    if (!isOwner && !isBorrower) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this request",
      });
    }

    res.json({
      success: true,
      data: { request },
    });
  } catch (error: any) {
    console.error("Get request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch request",
    });
  }
};

// Approve a borrow request (owner only)
export const approveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { dueDate } = req.body;
    const userId = req.user!.userId;

    // Fetch the request
    const request = await borrowRequestService.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Borrow request not found",
      });
    }

    // Only owner can approve
    if (request.bookCopy.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the book owner can approve requests",
      });
    }

    // Check request is pending
    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Cannot approve a request with status: ${request.status}`,
      });
    }

    // Calculate due date (default 14 days)
    const borrowDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const updatedRequest = await borrowRequestService.approve(id, borrowDueDate);

    res.json({
      success: true,
      message: "Request approved successfully",
      data: { request: updatedRequest },
    });
  } catch (error: any) {
    console.error("Approve request error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve request",
    });
  }
};

// Reject a borrow request (owner only)
export const rejectRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    // Fetch the request
    const request = await borrowRequestService.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Borrow request not found",
      });
    }

    // Only owner can reject
    if (request.bookCopy.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the book owner can reject requests",
      });
    }

    // Check request is pending
    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a request with status: ${request.status}`,
      });
    }

    const updatedRequest = await borrowRequestService.updateStatus(id, "REJECTED");

    res.json({
      success: true,
      message: "Request rejected",
      data: { request: updatedRequest },
    });
  } catch (error: any) {
    console.error("Reject request error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reject request",
    });
  }
};

// Mark book as returned (owner only)
export const markAsReturned = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    // Fetch the request
    const request = await borrowRequestService.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Borrow request not found",
      });
    }

    // Only owner can mark as returned
    if (request.bookCopy.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the book owner can mark as returned",
      });
    }

    // Check request is borrowed
    if (request.status !== "BORROWED") {
      return res.status(400).json({
        success: false,
        message: `Cannot mark as returned. Current status: ${request.status}`,
      });
    }

    const updatedRequest = await borrowRequestService.updateStatus(id, "RETURNED");

    res.json({
      success: true,
      message: "Book marked as returned",
      data: { request: updatedRequest },
    });
  } catch (error: any) {
    console.error("Mark as returned error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark as returned",
    });
  }
};

// Cancel a borrow request (borrower only, only if pending)
export const cancelRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    // Fetch the request
    const request = await borrowRequestService.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Borrow request not found",
      });
    }

    // Only borrower can cancel
    if (request.borrowerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the requester can cancel their request",
      });
    }

    // Can only cancel pending requests
    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request with status: ${request.status}`,
      });
    }

    // Use REJECTED status for cancellation (borrower-initiated)
    const updatedRequest = await borrowRequestService.updateStatus(id, "REJECTED");

    res.json({
      success: true,
      message: "Request cancelled",
      data: { request: updatedRequest },
    });
  } catch (error: any) {
    console.error("Cancel request error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel request",
    });
  }
};
