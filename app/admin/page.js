import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export default async function AdminPage() {
  const products = getProducts({ sort: "newest" });
  const orders = getOrders();
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <main className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Admin</p>
        <h1>Панель управления</h1>
        <p className="intro">
          MVP admin panel показывает товары, локальные заказы из checkout и базовую аналитику.
        </p>
      </div>

      <section className="stats-grid">
        <div className="stat-card"><span>Товары</span><strong>{products.length}</strong></div>
        <div className="stat-card"><span>Заказы</span><strong>{orders.length}</strong></div>
        <div className="stat-card"><span>Выручка</span><strong>{formatPrice(revenue)}</strong></div>
        <div className="stat-card"><span>Средний чек</span><strong>{formatPrice(orders.length ? revenue / orders.length : 0)}</strong></div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Orders</p>
          <h2>Последние заказы</h2>
        </div>
        <div className="cart-list">
          {orders.length ? orders.map((order) => (
            <article className="info-panel" key={order.orderNumber}>
              <h3>{order.orderNumber} - {formatPrice(order.total)}</h3>
              <p>{order.customerName}, {order.customerPhone}, {order.deliveryAddress}</p>
              <p>Статус: {order.status}</p>
            </article>
          )) : (
            <div className="info-panel">
              <h3>Заказов пока нет</h3>
              <p>Оформите тестовый заказ через checkout, и он появится здесь.</p>
              <Link className="primary-button" href="/shop">Перейти в магазин</Link>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Products</p>
          <h2>Каталог</h2>
        </div>
        <div className="cart-list">
          {products.map((product) => (
            <article className="info-panel" key={product.id}>
              <h3>{product.name}</h3>
              <p>{formatPrice(product.price)} - stock: {product.stockQuantity}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
