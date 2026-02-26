import prisma from "../prisma/client";
import { RequestStatus } from "@prisma/client";

export interface CreateBorrowRequestInput {
  bookCopyId: string;
  borrowerId: string;
}

/**
 * BorrowRequest Service - Database operations for BorrowRequest model
 */
export const borrowRequestService = {
  /**
   * Create a new borrow request
   */
  async create(data: CreateBorrowRequestInput) {
    // Update book copy status to REQUESTED
    await prisma.bookCopy.update({
      where: { id: data.bookCopyId },
      data: { availabilityStatus: "REQUESTED" },
    });

    return prisma.borrowRequest.create({
      data,
      include: {
        bookCopy: {
          include: {
            book: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Find borrow request by ID
   */
  async findById(id: string) {
    return prisma.borrowRequest.findUnique({
      where: { id },
      include: {
        bookCopy: {
          include: {
            book: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                location: true,
              },
            },
          },
        },
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
          },
        },
        chat: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 20,
            },
          },
        },
      },
    });
  },

  /**
   * Find requests for a specific book copy
   */
  async findByBookCopyId(bookCopyId: string) {
    return prisma.borrowRequest.findMany({
      where: { bookCopyId },
      include: {
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Find requests made by a borrower
   */
  async findByBorrowerId(borrowerId: string) {
    return prisma.borrowRequest.findMany({
      where: { borrowerId },
      include: {
        bookCopy: {
          include: {
            book: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Find requests for books owned by a user
   */
  async findForOwner(ownerId: string) {
    return prisma.borrowRequest.findMany({
      where: {
        bookCopy: {
          ownerId,
        },
      },
      include: {
        bookCopy: {
          include: {
            book: true,
          },
        },
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Update request status
   */
  async updateStatus(id: string, status: RequestStatus) {
    const request = await prisma.borrowRequest.update({
      where: { id },
      data: { status },
      include: {
        bookCopy: true,
      },
    });

    // Update book copy status based on request status
    if (status === "APPROVED") {
      // Create chat for communication
      await prisma.chat.create({
        data: { requestId: id },
      });
    } else if (status === "REJECTED") {
      await prisma.bookCopy.update({
        where: { id: request.bookCopyId },
        data: { availabilityStatus: "AVAILABLE" },
      });
    } else if (status === "RETURNED") {
      await prisma.bookCopy.update({
        where: { id: request.bookCopyId },
        data: {
          availabilityStatus: "AVAILABLE",
          currentBorrowerId: null,
          dueDate: null,
        },
      });
    }

    return request;
  },

  /**
   * Approve request and mark book as borrowed
   */
  async approve(id: string, dueDate: Date) {
    const request = await prisma.borrowRequest.findUnique({
      where: { id },
    });

    if (!request) throw new Error("Request not found");

    // Update request status
    await this.updateStatus(id, "BORROWED");

    // Mark book copy as borrowed
    await prisma.bookCopy.update({
      where: { id: request.bookCopyId },
      data: {
        availabilityStatus: "BORROWED",
        currentBorrowerId: request.borrowerId,
        dueDate,
      },
    });

    return this.findById(id);
  },

  /**
   * Delete borrow request
   */
  async delete(id: string) {
    return prisma.borrowRequest.delete({
      where: { id },
    });
  },
};
