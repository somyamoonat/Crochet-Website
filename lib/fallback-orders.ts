import fs from "fs";
import path from "path";

export interface FallbackOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  imageSnapshot?: string | null;
}

export interface FallbackOrder {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  status: "RECEIVED" | "CONFIRMED" | "MAKING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  deliveryType: "DELIVERY" | "PICKUP";
  addressDetails?: {
    line1?: string;
    line2?: string;
    city?: string;
    pincode?: string;
  } | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "RAZORPAY" | "PAY_ON_DELIVERY";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  notes?: string | null;
  createdAt: string;
  items: FallbackOrderItem[];
}

const ORDERS_FILE = path.join(process.cwd(), ".orders-store.json");

function loadOrdersFromFile(): FallbackOrder[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Could not read .orders-store.json:", err);
  }
  return [];
}

function persistOrdersToFile(orders: FallbackOrder[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write .orders-store.json:", err);
  }
}

const globalForFallback = globalThis as unknown as {
  fallbackOrders: FallbackOrder[];
};

// Start with empty list or previously saved real orders — NO HARDCODED DEMO ORDERS
export const fallbackOrders: FallbackOrder[] = globalForFallback.fallbackOrders ?? loadOrdersFromFile();
globalForFallback.fallbackOrders = fallbackOrders;

export function saveFallbackOrder(order: Omit<FallbackOrder, "id" | "createdAt">): FallbackOrder {
  const newOrder: FallbackOrder = {
    ...order,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const currentList = globalForFallback.fallbackOrders || [];
  currentList.unshift(newOrder);
  globalForFallback.fallbackOrders = currentList;
  persistOrdersToFile(currentList);

  return newOrder;
}

export function getFallbackOrderById(id: string): FallbackOrder | undefined {
  const currentList = globalForFallback.fallbackOrders || [];
  return currentList.find((o) => o.id === id || o.orderNumber === id);
}

export function getFallbackOrderByOrderNumber(orderNumber: string): FallbackOrder | undefined {
  const currentList = globalForFallback.fallbackOrders || [];
  return currentList.find((o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() || o.id === orderNumber);
}

export function getFallbackOrdersByUserId(userId: string, email?: string | null): FallbackOrder[] {
  const currentList = globalForFallback.fallbackOrders || [];
  return currentList.filter((o) => {
    if (o.userId && o.userId === userId) return true;
    if (email && o.guestEmail && o.guestEmail.toLowerCase() === email.toLowerCase()) return true;
    return false;
  });
}

export function updateFallbackOrder(id: string, updates: Partial<FallbackOrder>): FallbackOrder | undefined {
  const currentList = globalForFallback.fallbackOrders || [];
  const index = currentList.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return undefined;

  currentList[index] = { ...currentList[index], ...updates };
  globalForFallback.fallbackOrders = currentList;
  persistOrdersToFile(currentList);

  return currentList[index];
}

export function getAllFallbackOrders(): FallbackOrder[] {
  globalForFallback.fallbackOrders = loadOrdersFromFile();
  return globalForFallback.fallbackOrders || [];
}

export function clearAllFallbackOrders(): void {
  globalForFallback.fallbackOrders = [];
  persistOrdersToFile([]);
}
