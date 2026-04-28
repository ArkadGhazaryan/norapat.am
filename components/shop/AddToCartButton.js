"use client";

import { useCart } from "@/components/cart/CartProvider";

export function AddToCartButton({ productId, label = "В корзину" }) {
  const { addItem } = useCart();

  return (
    <button className="primary-button" type="button" onClick={() => addItem(productId)}>
      {label}
    </button>
  );
}
