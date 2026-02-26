import { Request, Response } from "express";
import { bookService } from "../services";

/**
 * Create a new book
 * POST /api/books
 */
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, description, coverImageUrl, genreIds } = req.body;

    if (!title || !author || !description) {
      res.status(400).json({
        success: false,
        message: "Title, author, and description are required",
      });
      return;
    }

    const book = await bookService.create({
      title,
      author,
      description,
      coverImageUrl,
      genreIds,
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: { book },
    });
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get all books (paginated)
 * GET /api/books
 */
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const genreId = req.query.genreId as string | undefined;

    const result = await bookService.findAll(page, limit, genreId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Search books
 * GET /api/books/search
 */
export const searchBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
      res.status(400).json({
        success: false,
        message: "Search query is required",
      });
      return;
    }

    const result = await bookService.search(query, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Search books error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get book by ID
 * GET /api/books/:id
 */
export const getBookById = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const book = await bookService.findById(id);

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { book },
    });
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update book
 * PUT /api/books/:id
 */
export const updateBook = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, author, description, coverImageUrl, averageRating } = req.body;

    const existing = await bookService.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    const book = await bookService.update(id, {
      title,
      author,
      description,
      coverImageUrl,
      averageRating,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: { book },
    });
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Add genres to book
 * POST /api/books/:id/genres
 */
export const addGenresToBook = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { genreIds } = req.body;

    if (!genreIds || !Array.isArray(genreIds) || genreIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "genreIds array is required",
      });
      return;
    }

    const existing = await bookService.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    await bookService.addGenres(id, genreIds);
    const book = await bookService.findById(id);

    res.status(200).json({
      success: true,
      message: "Genres added successfully",
      data: { book },
    });
  } catch (error) {
    console.error("Add genres error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Remove genre from book
 * DELETE /api/books/:id/genres/:genreId
 */
export const removeGenreFromBook = async (req: Request<{id: string; genreId: string}>, res: Response): Promise<void> => {
  try {
    const { id, genreId } = req.params;

    const existing = await bookService.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    await bookService.removeGenre(id, genreId);
    const book = await bookService.findById(id);

    res.status(200).json({
      success: true,
      message: "Genre removed successfully",
      data: { book },
    });
  } catch (error) {
    console.error("Remove genre error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Delete book
 * DELETE /api/books/:id
 */
export const deleteBook = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await bookService.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    await bookService.delete(id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
