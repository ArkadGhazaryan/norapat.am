"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("norapat-cart");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("norapat-cart", JSON.stringify(items));
  }, [items]);

  const detailedItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          return product ? { ...product, quantity: item.quantity } : null;
        })
        .filter(Boolean),
    [items]
  );

  const total = detailedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const count = detailedItems.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(productId) {
    setItems((current) => {
      const existing = current.find((item) => item.id === productId);
      if (existing) {
        return current.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { id: productId, quantity: 1 }];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items: detailedItems,
        total,
        count,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
