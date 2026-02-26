import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader, TokenPayload } from "../utils/jwt";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Export for use in controllers
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Authentication middleware
 * Validates JWT token from Authorization header
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Silently continue without user info
    next();
  }
};
