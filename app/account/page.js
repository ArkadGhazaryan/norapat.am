import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Account</p>
        <h1>Кабинет клиента</h1>
        <p className="intro">
          Сейчас это MVP profile page. После подключения authentication здесь будут данные клиента,
          адреса, история заказов и wishlist.
        </p>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><span>Профиль</span><strong>Draft</strong></div>
        <div className="stat-card"><span>История заказов</span><strong>Local</strong></div>
        <div className="stat-card"><span>Адреса</span><strong>Next</strong></div>
      </div>
      <div className="hero-actions">
        <Link className="primary-button" href="/shop">Продолжить покупки</Link>
        <Link className="secondary-button" href="/cart">Открыть корзину</Link>
      </div>
    </main>
  );
}
