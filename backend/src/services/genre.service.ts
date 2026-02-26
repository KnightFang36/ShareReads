import prisma from "../prisma/client";

/**
 * Genre Service - Database operations for Genre model
 */
export const genreService = {
  /**
   * Create a new genre
   */
  async create(name: string) {
    return prisma.genre.create({
      data: { name },
    });
  },

  /**
   * Find genre by ID
   */
  async findById(id: string) {
    return prisma.genre.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });
  },

  /**
   * Find genre by name
   */
  async findByName(name: string) {
    return prisma.genre.findUnique({
      where: { name },
    });
  },

  /**
   * Find all genres
   */
  async findAll() {
    return prisma.genre.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  /**
   * Update genre
   */
  async update(id: string, name: string) {
    return prisma.genre.update({
      where: { id },
      data: { name },
    });
  },

  /**
   * Delete genre
   */
  async delete(id: string) {
    return prisma.genre.delete({
      where: { id },
    });
  },

  /**
   * Get books by genre (paginated)
   */
  async getBooksByGenre(genreId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      prisma.bookGenre.findMany({
        where: { genreId },
        skip,
        take: limit,
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
      }),
      prisma.bookGenre.count({ where: { genreId } }),
    ]);

    return {
      books: books.map(bg => bg.book),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
