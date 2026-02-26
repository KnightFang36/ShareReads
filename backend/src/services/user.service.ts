import prisma from "../prisma/client";
import { Prisma } from "@prisma/client";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  bio?: string;
  location?: string;
}

export interface UpdateUserInput {
  name?: string;
  bio?: string;
  location?: string;
}

/**
 * User Service - Database operations for User model
 */
export const userService = {
  /**
   * Create a new user
   */
  async create(data: CreateUserInput) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        createdAt: true,
      },
    });
  },

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        createdAt: true,
      },
    });
  },

  /**
   * Find user by email (includes password for auth)
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Find user by ID with full profile data
   */
  async findByIdWithProfile(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        createdAt: true,
        booksOwned: {
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
        },
        borrowRequests: {
          include: {
            bookCopy: {
              include: {
                book: true,
              },
            },
          },
        },
        circleMembership: {
          include: {
            circle: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    });
  },

  /**
   * Update user profile
   */
  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        createdAt: true,
      },
    });
  },

  /**
   * Delete user
   */
  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  /**
   * Get all users (paginated)
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          location: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
