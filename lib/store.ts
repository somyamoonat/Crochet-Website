import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItemState {
  id: string; // Unique composite key e.g. `${productId}-${variantId || 'standard'}`
  productId: string;
  variantId?: string | null;
  name: string;
  title?: string; // Backwards-compatible alias for name
  price: number;
  image?: string;
  quantity: number;
  variant?: string; // e.g. "Color: Sage Green"
  variantName?: string;
  stockType?: "READY_TO_SHIP" | "MADE_TO_ORDER" | string;
  leadTimeDays?: number | null;
}

interface CartStore {
  items: CartItemState[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItemState, "quantity">, quantity?: number) => void;
  removeItem: (idOrProductId: string) => void;
  updateQuantity: (idOrProductId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  hasMadeToOrder: () => boolean;
  maxLeadTimeDays: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      setIsCartOpen: (open: boolean) => set({ isCartOpen: open }),
      addItem: (item, quantity = 1) => {
        const currentItems = get().items;
        const targetId = item.id || `${item.productId}-${item.variantId || "standard"}`;
        const itemName = item.name || item.title || "Crochet Item";
        const existingItem = currentItems.find((i) => i.id === targetId);

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === targetId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                ...item,
                id: targetId,
                name: itemName,
                title: itemName,
                quantity,
              },
            ],
          });
        }
      },
      removeItem: (idOrProductId: string) => {
        set({
          items: get().items.filter(
            (item) => item.id !== idOrProductId && item.productId !== idOrProductId
          ),
        });
      },
      updateQuantity: (idOrProductId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(idOrProductId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === idOrProductId || item.productId === idOrProductId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      hasMadeToOrder: () => {
        return get().items.some(
          (item) => item.stockType === "MADE_TO_ORDER"
        );
      },
      maxLeadTimeDays: () => {
        const leadTimes = get()
          .items.filter((item) => item.stockType === "MADE_TO_ORDER")
          .map((item) => item.leadTimeDays || 4);
        return leadTimes.length > 0 ? Math.max(...leadTimes) : 0;
      },
    }),
    {
      name: "the-crochet-diaryy-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
