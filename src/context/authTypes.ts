import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  status: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);
