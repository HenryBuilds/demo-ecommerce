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
  userId: string;
  email: string;
  role: string;
}

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  downloadUrl: string | null;
  status: ProductStatus;
  slug: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProductWithStats = Product & {
  _count: {
    orderItems: number;
  };
};

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  downloadUrl: string;
  category: string;
  tags: string[];
  status: ProductStatus;
};

export type AdminProductsData = {
  products: ProductWithStats[];
  stats: Record<string, number>;
  totalRevenue: number;
};

export type ProductFilters = {
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
};

export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  stripePaymentId: string | null;
  customerEmail: string;
  customerName: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  user?: User | null;
  orderItems: OrderItem[];
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  order: Order;
  productId: string;
  product: Product;
  createdAt: string;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type ProductApiResponse = ApiResponse<{
  product: Product;
}>;

export type ProductsApiResponse = ApiResponse<{
  products: Product[];
}>;

export type AdminProductsApiResponse = ApiResponse<AdminProductsData>;

export type AuthApiResponse = ApiResponse<{
  user: User;
  token?: string;
}>;

export type ValidationErrors = Record<string, string>;

export type FormState<T> = {
  data: T;
  errors: ValidationErrors;
  loading: boolean;
  touched: Record<keyof T, boolean>;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  slug: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
};

export type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity" | "id"> & { quantity?: number };
    }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

export type CartContextType = {
  state: CartState;
  addItem: (
    product: Omit<CartItem, "quantity" | "id"> & { quantity?: number }
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
};

export type PaginationData = {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};
