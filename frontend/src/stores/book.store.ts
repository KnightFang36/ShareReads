// Book Store using Zustand
import { create } from "zustand";
import api from "@/lib/api";

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
  condition: string;
  availabilityStatus: string;
  location: string;
  book?: Book;
  owner?: {
    id: string;
    name: string;
    location?: string;
  };
}

interface BookState {
  books: Book[];
  genres: Genre[];
  selectedBook: Book | null;
  availableCopies: BookCopy[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  fetchBooks: (page?: number, limit?: number) => Promise<void>;
  searchBooks: (query: string) => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  fetchGenres: () => Promise<void>;
  fetchAvailableCopies: (bookId: string) => Promise<void>;
  createBook: (data: Partial<Book> & { genreIds?: string[] }) => Promise<Book>;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  genres: [],
  selectedBook: null,
  availableCopies: [],
  isLoading: false,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },

  fetchBooks: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/books?page=${page}&limit=${limit}`);
      const { books, pagination } = response.data.data;
      set({ books, pagination, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  searchBooks: async (query: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
      const { books, pagination } = response.data.data;
      set({ books, pagination, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchBookById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/books/${id}`);
      set({ selectedBook: response.data.data.book, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchGenres: async () => {
    try {
      const response = await api.get("/genres");
      set({ genres: response.data.data.genres });
    } catch (error) {
      throw error;
    }
  },

  fetchAvailableCopies: async (bookId: string) => {
    try {
      const response = await api.get(`/copies/book/${bookId}/available`);
      set({ availableCopies: response.data.data.copies });
    } catch (error) {
      throw error;
    }
  },

  createBook: async (data) => {
    const response = await api.post("/books", data);
    return response.data.data.book;
  },
}));
