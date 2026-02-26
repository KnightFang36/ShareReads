// Common TypeScript types for the application

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  createdAt: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl?: string;
  averageRating: number;
  createdAt: string;
  genres?: { genre: Genre }[];
  _count?: { copies: number };
}

export interface BookCopy {
  id: string;
  bookId: string;
  ownerId: string;
  condition: BookCondition;
  availabilityStatus: AvailabilityStatus;
  location: string;
  currentBorrowerId?: string;
  dueDate?: string;
  createdAt: string;
  book?: Book;
  owner?: Pick<User, "id" | "name" | "location">;
}

export interface BorrowRequest {
  id: string;
  bookCopyId: string;
  borrowerId: string;
  status: RequestStatus;
  createdAt: string;
  bookCopy?: BookCopy;
  borrower?: Pick<User, "id" | "name" | "email">;
}

export type BookCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
export type AvailabilityStatus = "AVAILABLE" | "REQUESTED" | "BORROWED";
export type RequestStatus = "PENDING" | "APPROVED" | "BORROWED" | "RETURNED" | "REJECTED";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
