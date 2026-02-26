import prisma from "../prisma/client";

export interface CreateBookInput {
  title: string;
  author: string;
  description: string;
  coverImageUrl?: string;
  genreIds?: string[];
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  description?: string;
  coverImageUrl?: string;
  averageRating?: number;
}

/**
 * Book Service - Database operations for Book model
 */
export const bookService = {
  /**
   * Create a new book
   */
  async create(data: CreateBookInput) {
    const { genreIds, ...bookData } = data;
    
    return prisma.book.create({
      data: {
        ...bookData,
        genres: genreIds ? {
          create: genreIds.map(genreId => ({ genreId })),
        } : undefined,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
  },

  /**
   * Find book by ID
   */
  async findById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        copies: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
        },
      },
    });
  },

  /**
   * Find all books (paginated)
   */
  async findAll(page: number = 1, limit: number = 10, genreId?: string) {
    const skip = (page - 1) * limit;
    const where = genreId ? {
      genres: {
        some: {
          genreId,
        },
      },
    } : {};

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
          _count: {
            select: {
              copies: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Search books by title or author
   */
  async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where = {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { author: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Update book
   */
  async update(id: string, data: UpdateBookInput) {
    return prisma.book.update({
      where: { id },
      data,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
  },

  /**
   * Add genres to book
   */
  async addGenres(bookId: string, genreIds: string[]) {
    return prisma.bookGenre.createMany({
      data: genreIds.map(genreId => ({ bookId, genreId })),
      skipDuplicates: true,
    });
  },

  /**
   * Remove genre from book
   */
  async removeGenre(bookId: string, genreId: string) {
    return prisma.bookGenre.deleteMany({
      where: { bookId, genreId },
    });
  },

  /**
   * Delete book
   */
  async delete(id: string) {
    return prisma.book.delete({
      where: { id },
    });
  },
};
