import prisma from "../prisma/client";

export interface CreateMessageInput {
  chatId: string;
  senderId: string;
  content: string;
}

/**
 * Chat Service - Database operations for Chat and Message models
 */
export const chatService = {
  /**
   * Create a chat for a borrow request
   */
  async create(requestId: string) {
    return prisma.chat.create({
      data: { requestId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        request: {
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
            borrower: {
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
   * Find chat by ID
   */
  async findById(id: string) {
    return prisma.chat.findUnique({
      where: { id },
      include: {
        request: {
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
            borrower: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
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
   * Find chat by borrow request ID
   */
  async findByRequestId(requestId: string) {
    return prisma.chat.findUnique({
      where: { requestId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
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
   * Find all chats for a user
   */
  async findByUserId(userId: string) {
    return prisma.chat.findMany({
      where: {
        OR: [
          { request: { borrowerId: userId } },
          { request: { bookCopy: { ownerId: userId } } },
        ],
      },
      include: {
        request: {
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
            borrower: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Send a message in a chat
   * Accepts either an object or individual parameters
   */
  async sendMessage(
    chatIdOrData: string | CreateMessageInput,
    senderId?: string,
    content?: string
  ) {
    const data: CreateMessageInput =
      typeof chatIdOrData === "string"
        ? { chatId: chatIdOrData, senderId: senderId!, content: content! }
        : chatIdOrData;

    return prisma.message.create({
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
   * Get messages for a chat (paginated)
   */
  async getMessages(chatId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { chatId },
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
      prisma.message.count({ where: { chatId } }),
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
   * Delete a message
   */
  async deleteMessage(id: string) {
    return prisma.message.delete({
      where: { id },
    });
  },

  /**
   * Get or create chat for a borrow request
   */
  async getOrCreateChat(requestId: string) {
    let chat = await this.findByRequestId(requestId);

    if (!chat) {
      chat = await this.create(requestId);
    }

    return chat;
  },

  /**
   * Check if user has access to chat by request ID
   */
  async userHasAccessByRequestId(requestId: string, userId: string) {
    const request = await prisma.borrowRequest.findUnique({
      where: { id: requestId },
      include: { bookCopy: true },
    });

    if (!request) return false;

    return request.borrowerId === userId || request.bookCopy.ownerId === userId;
  },

  /**
   * Check if user has access to chat by chat ID
   */
  async userHasAccess(chatId: string, userId: string) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        request: {
          include: { bookCopy: true },
        },
      },
    });

    if (!chat) return false;

    return (
      chat.request.borrowerId === userId ||
      chat.request.bookCopy.ownerId === userId
    );
  },
};
