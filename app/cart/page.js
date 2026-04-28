"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const delivery = items.length ? 700 : 0;

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
            <div className="summary-line"><span>Доставка</span><strong>{formatPrice(delivery)}</strong></div>
            <div className="summary-line"><span>К оплате</span><strong>{formatPrice(total + delivery)}</strong></div>
            <Link className="primary-button" href="/checkout">Оформить заказ</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
