export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'member';
  created_at?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  category?: string;
  description?: string;
  total_copies: number;
  available_copies: number;
  location?: string;
  created_at?: string;
}

export interface Borrowing {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  notes?: string;
  user_name?: string;
  user_email?: string;
  book_title?: string;
  book_author?: string;
  days_overdue?: number;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
}

export interface Statistics {
  totalBooks: number;
  totalUsers: number;
  totalBorrowings: number;
  overdueBooks: number;
}
