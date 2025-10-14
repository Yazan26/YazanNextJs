export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}
