import { ReactNode } from "react";

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: "ADMIN";
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "USER" | "ADMIN";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface UserGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}
