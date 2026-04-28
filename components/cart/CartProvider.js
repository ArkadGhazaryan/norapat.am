"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
    () => items.filter(Boolean),
    [items]
  );

  const total = detailedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const count = detailedItems.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(product) {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
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
