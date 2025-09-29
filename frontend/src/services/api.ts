import axios from 'axios';
import { User, Book, Borrowing, RegisterData, Statistics } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Return a more detailed error
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Books API
export const booksAPI = {
  getAll: async (filters?: { category?: string; author?: string; title?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.author) params.append('author', filters.author);
    if (filters?.title) params.append('title', filters.title);
    
    const response = await api.get(`/books?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  
  create: async (bookData: Partial<Book>) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },
  
  update: async (id: number, bookData: Partial<Book>) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/books/categories');
    return response.data;
  },
};

// Borrowings API
export const borrowingsAPI = {
  getAll: async (filters?: { user_id?: number; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.user_id) params.append('user_id', filters.user_id.toString());
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/borrowings?${params.toString()}`);
    return response.data;
  },
  
  create: async (borrowingData: { book_id: number; borrow_date: string; due_date: string; notes?: string }) => {
    const response = await api.post('/borrowings', borrowingData);
    return response.data;
  },
  
  returnBook: async (id: number, return_date: string) => {
    const response = await api.put(`/borrowings/${id}/return`, { return_date });
    return response.data;
  },
  
  getMyBorrowings: async () => {
    const response = await api.get('/borrowings/my-borrowings');
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/borrowings/statistics');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  create: async (userData: RegisterData & { role?: string }) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  update: async (id: number, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;
