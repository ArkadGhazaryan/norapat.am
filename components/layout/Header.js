"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export function Header() {
  const { count } = useCart();

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">N</span>
        <span>
          <strong>Norapat</strong>
          <small>Фудкорт и доставка</small>
        </span>
      </Link>
      <nav className="main-nav" aria-label="Главная навигация">
        <Link href="/shop">Магазин</Link>
        <Link href="/account">Кабинет</Link>
        <Link href="/admin">Админ</Link>
        <Link className="cart-link" href="/cart">
          Корзина <span>{count}</span>
        </Link>
      </nav>
    </header>
  );
}
