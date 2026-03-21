"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCart, updateCartItem, removeFromCart } from "@/lib/actions/cart.actions";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type CartProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: { name: string };
};

type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  total: number;
  loading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!session?.user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const cart = await getCart();
      setItems((cart?.items as CartItem[]) ?? []);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function addItem(productId: string, quantity = 1) {
    if (!session?.user) {
      toast.error("Please login to add items to cart");
      return;
    }
    const result = await addToCart(productId, quantity);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Added to cart!");
      await refreshCart();
    }
  }

  async function updateItem(itemId: string, quantity: number) {
    await updateCartItem(itemId, quantity);
    await refreshCart();
  }

  async function removeItem(itemId: string) {
    await removeFromCart(itemId);
    toast.success("Item removed");
    await refreshCart();
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, total, loading, addItem, updateItem, removeItem, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
