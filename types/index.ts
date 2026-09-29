import type { User, Product, Category, Order, OrderItem, Address, Role, OrderStatus, PaymentStatus } from "@prisma/client";

export type { User, Product, Category, Order, OrderItem, Address, Role, OrderStatus, PaymentStatus };

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image: string | null;
}

export interface CartProductItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
