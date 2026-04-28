"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const delivery = items.length ? 700 : 0;

  async function applyPromo() {
    setMessage("");
    setDiscount(0);
    const response = await fetch("/api/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode, subtotal: total }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "Промокод не применен");
      return;
    }
    setDiscount(result.discount);
    setMessage(`Скидка применена: -${formatPrice(result.discount)}`);
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Корзина</p>
        <h1>Ваш заказ</h1>
      </div>

      {!items.length ? (
        <div className="info-panel">
          <h2>Корзина пустая</h2>
          <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
          <Link className="primary-button" href="/shop">Открыть магазин</Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.imageUrl} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>{formatPrice(item.price)} за шт.</p>
                  <div className="quantity-control">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="action-row">
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <button className="danger-button" type="button" onClick={() => removeItem(item.id)}>
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="summary-card">
            <h2>Итого</h2>
            <div className="summary-line"><span>Товары</span><strong>{formatPrice(total)}</strong></div>
            <label className="summary-promo">
              Промокод
              <span className="input-with-button">
                <input value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="WELCOME10" />
                <button className="secondary-button" type="button" onClick={applyPromo}>OK</button>
              </span>
            </label>
            {message ? <p className={discount ? "form-success" : "form-error"}>{message}</p> : null}
            {discount ? <div className="summary-line"><span>Скидка</span><strong>-{formatPrice(discount)}</strong></div> : null}
            <div className="summary-line"><span>Доставка</span><strong>{formatPrice(delivery)}</strong></div>
            <div className="summary-line"><span>К оплате</span><strong>{formatPrice(total - discount + delivery)}</strong></div>
            <Link className="primary-button" href="/checkout">Оформить заказ</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
