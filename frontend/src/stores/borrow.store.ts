// Borrow Request Store
import { create } from "zustand";
import api from "@/lib/api";
import { BookCopy } from "./book.store";

export interface BorrowRequest {
  id: string;
  bookCopyId: string;
  borrowerId: string;
  status: "PENDING" | "APPROVED" | "BORROWED" | "RETURNED" | "REJECTED";
  createdAt: string;
  bookCopy?: BookCopy;
  borrower?: {
    id: string;
    name: string;
    email: string;
  };
}

interface BorrowState {
  myRequests: BorrowRequest[];
  incomingRequests: BorrowRequest[];
  myBookCopies: BookCopy[];
  isLoading: boolean;

  fetchMyRequests: () => Promise<void>;
  fetchIncomingRequests: () => Promise<void>;
  fetchMyBookCopies: () => Promise<void>;
  createRequest: (bookCopyId: string) => Promise<BorrowRequest>;
  approveRequest: (requestId: string, dueDate?: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  markAsReturned: (requestId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  shareBook: (bookId: string, condition: string, location: string) => Promise<BookCopy>;
}

export const useBorrowStore = create<BorrowState>((set) => ({
  myRequests: [],
  incomingRequests: [],
  myBookCopies: [],
  isLoading: false,

  fetchMyRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/requests/my-requests");
      set({ myRequests: response.data.data.requests, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchIncomingRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/requests/incoming");
      set({ incomingRequests: response.data.data.requests, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchMyBookCopies: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/copies");
      set({ myBookCopies: response.data.data.copies, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createRequest: async (bookCopyId: string) => {
    const response = await api.post("/requests", { bookCopyId });
    return response.data.data.request;
  },

  approveRequest: async (requestId: string, dueDate?: string) => {
    await api.post(`/requests/${requestId}/approve`, { dueDate });
  },

  rejectRequest: async (requestId: string) => {
    await api.post(`/requests/${requestId}/reject`);
  },

  markAsReturned: async (requestId: string) => {
    await api.post(`/requests/${requestId}/return`);
  },

  cancelRequest: async (requestId: string) => {
    await api.post(`/requests/${requestId}/cancel`);
  },

  shareBook: async (bookId: string, condition: string, location: string) => {
    const response = await api.post("/copies", { bookId, condition, location });
    return response.data.data.bookCopy;
  },
}));
