"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const delivery = items.length ? 700 : 0;
  const payableTotal = total - discount + delivery;

  async function applyPromo() {
    setPromoMessage("");
    setDiscount(0);
    if (!promoCode.trim()) return;

    const response = await fetch("/api/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode, subtotal: total }),
    });
    const result = await response.json();

    if (!response.ok) {
      setPromoMessage(result.error || "Промокод не применен");
      return;
    }

    setDiscount(result.discount);
    setPromoMessage(`Промокод применен: -${formatPrice(result.discount)}`);
  }

  async function submitOrder(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.get("name"),
        customerPhone: form.get("phone"),
        customerEmail: form.get("email"),
        deliveryAddress: form.get("address"),
        paymentMethod: form.get("payment"),
        promoCode: discount > 0 ? promoCode : "",
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      }),
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error || "Не получилось создать заказ");
      return;
    }

    clearCart();
    setOrderNumber(result.order.orderNumber);
  }

  if (orderNumber) {
    return (
      <main className="page-shell">
        <div className="info-panel">
          <p className="eyebrow">Заказ принят</p>
          <h1>Спасибо за заказ</h1>
          <p className="intro">
            Номер заказа: {orderNumber}. Менеджер свяжется с вами для подтверждения.
          </p>
          <Link className="primary-button" href="/shop">Вернуться в магазин</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Checkout</p>
        <h1>Оформление заказа</h1>
      </div>

      {!items.length ? (
        <div className="info-panel">
          <h2>Нет товаров для оформления</h2>
          <Link className="primary-button" href="/shop">Открыть магазин</Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <form className="form-grid" onSubmit={submitOrder}>
            <label>
              Имя
              <input name="name" required placeholder="Ваше имя" />
            </label>
            <label>
              Телефон
              <input name="phone" required placeholder="+374 ..." />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="email@example.com" />
            </label>
            <label>
              Адрес доставки
              <textarea name="address" required rows="4" placeholder="Город, улица, дом, квартира" />
            </label>
            <label>
              Способ оплаты
              <select name="payment" defaultValue="cash">
                <option value="cash">Наличными при получении</option>
                <option value="card" disabled>Online payment будет добавлен позже</option>
              </select>
            </label>
            <label>
              Промокод
              <span className="input-with-button">
                <input value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="WELCOME10" />
                <button className="secondary-button" type="button" onClick={applyPromo}>OK</button>
              </span>
            </label>
            {promoMessage ? <p className={discount > 0 ? "form-success" : "form-error"}>{promoMessage}</p> : null}
            {error ? <p className="form-error">{error}</p> : null}
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Создаем заказ..." : "Подтвердить заказ"}
            </button>
          </form>
          <aside className="summary-card">
            <h2>Состав заказа</h2>
            {items.map((item) => (
              <div className="summary-line" key={item.id}>
                <span>{item.name} x {item.quantity}</span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
            {discount > 0 ? <div className="summary-line"><span>Скидка</span><strong>-{formatPrice(discount)}</strong></div> : null}
            <div className="summary-line"><span>Доставка</span><strong>{formatPrice(delivery)}</strong></div>
            <div className="summary-line"><span>Итого</span><strong>{formatPrice(payableTotal)}</strong></div>
          </aside>
        </div>
      )}
    </main>
  );
}
