import prisma from "../prisma/client";
import { BookCondition, AvailabilityStatus } from "@prisma/client";

export interface CreateBookCopyInput {
  bookId: string;
  ownerId: string;
  condition: BookCondition;
  location: string;
}

export interface UpdateBookCopyInput {
  condition?: BookCondition;
  availabilityStatus?: AvailabilityStatus;
  location?: string;
  currentBorrowerId?: string | null;
  dueDate?: Date | null;
}

/**
 * BookCopy Service - Database operations for BookCopy model
 */
export const bookCopyService = {
  /**
   * Create a new book copy (user sharing a book)
   */
  async create(data: CreateBookCopyInput) {
    return prisma.bookCopy.create({
      data,
      include: {
        book: {
          include: {
            genres: {
              include: {
                genre: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
  },

  /**
   * Find book copy by ID
   */
  async findById(id: string) {
    return prisma.bookCopy.findUnique({
      where: { id },
      include: {
        book: {
          include: {
            genres: {
              include: {
                genre: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        borrowRequests: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  },

  /**
   * Find all available copies of a book
   */
  async findAvailableByBookId(bookId: string) {
    return prisma.bookCopy.findMany({
      where: {
        bookId,
        availabilityStatus: "AVAILABLE",
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
  },

  /**
   * Find all copies owned by a user
   */
  async findByOwnerId(ownerId: string) {
    return prisma.bookCopy.findMany({
      where: { ownerId },
      include: {
        book: {
          include: {
            genres: {
              include: {
                genre: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Update book copy
   */
  async update(id: string, data: UpdateBookCopyInput) {
    return prisma.bookCopy.update({
      where: { id },
      data,
      include: {
        book: true,
        owner: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
  },

  /**
   * Mark copy as borrowed
   */
  async markAsBorrowed(id: string, borrowerId: string, dueDate: Date) {
    return prisma.bookCopy.update({
      where: { id },
      data: {
        availabilityStatus: "BORROWED",
        currentBorrowerId: borrowerId,
        dueDate,
      },
    });
  },

  /**
   * Mark copy as returned
   */
  async markAsReturned(id: string) {
    return prisma.bookCopy.update({
      where: { id },
      data: {
        availabilityStatus: "AVAILABLE",
        currentBorrowerId: null,
        dueDate: null,
      },
    });
  },

  /**
   * Delete book copy
   */
  async delete(id: string) {
    return prisma.bookCopy.delete({
      where: { id },
    });
  },
};
