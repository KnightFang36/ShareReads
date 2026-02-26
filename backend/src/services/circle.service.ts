import prisma from "../prisma/client";

export interface CreateCircleInput {
  name: string;
  bookId: string;
  creatorId: string;
}

export interface CreateCircleMessageInput {
  circleId: string;
  senderId: string;
  content: string;
}

const MAX_CIRCLE_MEMBERS = 8;
const MIN_CIRCLE_MEMBERS = 5;

/**
 * ReadingCircle Service - Database operations for ReadingCircle, CircleMember, and CircleMessage models
 */
export const circleService = {
  /**
   * Create a new reading circle
   */
  async create(data: CreateCircleInput) {
    const { creatorId, ...circleData } = data;

    // Create circle and add creator as first member
    const circle = await prisma.readingCircle.create({
      data: {
        ...circleData,
        members: {
          create: {
            userId: creatorId,
            progress: 0,
          },
        },
      },
      include: {
        book: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return circle;
  },

  /**
   * Find circle by ID
   */
  async findById(id: string) {
    return prisma.readingCircle.findUnique({
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
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                bio: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },

  /**
   * Find all circles (paginated)
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [circles, total] = await Promise.all([
      prisma.readingCircle.findMany({
        skip,
        take: limit,
        include: {
          book: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.readingCircle.count(),
    ]);

    return {
      circles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Find circles user is a member of
   */
  async findByUserId(userId: string) {
    return prisma.readingCircle.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        book: true,
        members: {
          include: {
            user: {
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
   * Join a circle
   */
  async join(circleId: string, userId: string) {
    // Check member count
    const memberCount = await prisma.circleMember.count({
      where: { circleId },
    });

    if (memberCount >= MAX_CIRCLE_MEMBERS) {
      throw new Error(`Circle is full (max ${MAX_CIRCLE_MEMBERS} members)`);
    }

    // Check if already a member
    const existingMember = await prisma.circleMember.findUnique({
      where: {
        circleId_userId: {
          circleId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new Error("Already a member of this circle");
    }

    return prisma.circleMember.create({
      data: {
        circleId,
        userId,
        progress: 0,
      },
      include: {
        circle: {
          include: {
            book: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  /**
   * Leave a circle
   */
  async leave(circleId: string, userId: string) {
    return prisma.circleMember.delete({
      where: {
        circleId_userId: {
          circleId,
          userId,
        },
      },
    });
  },

  /**
   * Update member progress
   */
  async updateProgress(circleId: string, userId: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }

    return prisma.circleMember.update({
      where: {
        circleId_userId: {
          circleId,
          userId,
        },
      },
      data: { progress },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  /**
   * Get average progress of all members
   */
  async getAverageProgress(circleId: string) {
    const result = await prisma.circleMember.aggregate({
      where: { circleId },
      _avg: {
        progress: true,
      },
    });

    return result._avg.progress || 0;
  },

  /**
   * Send message in circle
   */
  async sendMessage(data: CreateCircleMessageInput) {
    // Verify user is a member
    const member = await prisma.circleMember.findUnique({
      where: {
        circleId_userId: {
          circleId: data.circleId,
          userId: data.senderId,
        },
      },
    });

    if (!member) {
      throw new Error("Must be a member to send messages");
    }

    return prisma.circleMessage.create({
      data,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  /**
   * Get circle messages (paginated)
   */
  async getMessages(circleId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.circleMessage.findMany({
        where: { circleId },
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.circleMessage.count({ where: { circleId } }),
    ]);

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Delete circle
   */
  async delete(id: string) {
    return prisma.readingCircle.delete({
      where: { id },
    });
  },

  /**
   * Check if user is a member of a circle
   */
  async isMember(circleId: string, userId: string) {
    const member = await prisma.circleMember.findUnique({
      where: {
        circleId_userId: {
          circleId,
          userId,
        },
      },
    });
    return !!member;
  },

  /**
   * Get member info
   */
  async getMember(circleId: string, userId: string) {
    return prisma.circleMember.findUnique({
      where: {
        circleId_userId: {
          circleId,
          userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
};
