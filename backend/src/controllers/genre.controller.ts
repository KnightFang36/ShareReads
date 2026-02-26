import { Request, Response } from "express";
import { genreService } from "../services";

/**
 * Create a new genre
 * POST /api/genres
 */
export const createGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Genre name is required",
      });
      return;
    }

    // Check if genre already exists
    const existing = await genreService.findByName(name);
    if (existing) {
      res.status(409).json({
        success: false,
        message: "Genre already exists",
      });
      return;
    }

    const genre = await genreService.create(name);

    res.status(201).json({
      success: true,
      message: "Genre created successfully",
      data: { genre },
    });
  } catch (error) {
    console.error("Create genre error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get all genres
 * GET /api/genres
 */
export const getAllGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const genres = await genreService.findAll();

    res.status(200).json({
      success: true,
      data: { genres },
    });
  } catch (error) {
    console.error("Get genres error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get genre by ID
 * GET /api/genres/:id
 */
export const getGenreById = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const genre = await genreService.findById(id);

    if (!genre) {
      res.status(404).json({
        success: false,
        message: "Genre not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { genre },
    });
  } catch (error) {
    console.error("Get genre error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get books by genre
 * GET /api/genres/:id/books
 */
export const getBooksByGenre = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const genre = await genreService.findById(id);
    if (!genre) {
      res.status(404).json({
        success: false,
        message: "Genre not found",
      });
      return;
    }

    const result = await genreService.getBooksByGenre(id, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get books by genre error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update genre
 * PUT /api/genres/:id
 */
export const updateGenre = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Genre name is required",
      });
      return;
    }

    const existing = await genreService.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Genre not found",
      });
      return;
    }

    const genre = await genreService.update(id, name);

    res.status(200).json({
      success: true,
      message: "Genre updated successfully",
      data: { genre },
    });
  } catch (error) {
    console.error("Update genre error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Delete genre
 * DELETE /api/genres/:id
 */
export const deleteGenre = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await genreService.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Genre not found",
      });
      return;
    }

    await genreService.delete(id);

    res.status(200).json({
      success: true,
      message: "Genre deleted successfully",
    });
  } catch (error) {
    console.error("Delete genre error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
