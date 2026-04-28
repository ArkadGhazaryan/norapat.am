import { requireAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/orders";
import { getAllCategories, getProducts } from "@/lib/products";
import { getPromoCodes } from "@/lib/promos";
import { getAnalytics } from "@/lib/analytics";
import { getUsers } from "@/lib/users";
import { formatPrice } from "@/lib/format";
import {
  changeOrderStatus,
  logoutAdmin,
  removeCategory,
  removeProduct,
  removePromo,
  saveCategory,
  saveProduct,
  savePromo,
} from "@/app/admin/actions";

const orderStatuses = ["new", "confirmed", "preparing", "delivering", "completed", "cancelled"];

export default async function AdminPage() {
  await requireAdmin();

  const products = getProducts({ sort: "newest" });
  const categories = getAllCategories();
  const orders = getOrders();
  const promos = getPromoCodes();
  const users = getUsers();
  const analytics = getAnalytics();
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <main className="page-shell">
      <div className="page-heading admin-heading">
        <div>
          <p className="eyebrow">Админ</p>
          <h1>Панель управления</h1>
          <p className="intro">Управление товарами, категориями, заказами и промокодами.</p>
        </div>
        <form action={logoutAdmin}>
          <button className="secondary-button" type="submit">Выйти</button>
        </form>
      </div>

      <section className="stats-grid">
        <div className="stat-card"><span>Товары</span><strong>{products.length}</strong></div>
        <div className="stat-card"><span>Заказы</span><strong>{orders.length}</strong></div>
        <div className="stat-card"><span>Выручка</span><strong>{formatPrice(revenue)}</strong></div>
        <div className="stat-card"><span>Средний чек</span><strong>{formatPrice(orders.length ? revenue / orders.length : 0)}</strong></div>
        <div className="stat-card"><span>Клиенты</span><strong>{users.length}</strong></div>
      </section>

      <section className="section admin-section">
        <div className="section-heading">
          <p className="eyebrow">Аналитика</p>
          <h2>Продажи и клиенты</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><span>Сегодня</span><strong>{formatPrice(analytics.today.revenue)}</strong><p>{analytics.today.count} заказов</p></div>
          <div className="stat-card"><span>7 дней</span><strong>{formatPrice(analytics.week.revenue)}</strong><p>{analytics.week.count} заказов</p></div>
          <div className="stat-card"><span>30 дней</span><strong>{formatPrice(analytics.month.revenue)}</strong><p>{analytics.month.count} заказов</p></div>
        </div>
        <div className="analytics-grid">
          <AnalyticsList title="Заказы по статусам" items={analytics.ordersByStatus.map((item) => `${item.status}: ${item.count}`)} />
          <AnalyticsList title="Топ товаров" items={analytics.topProducts.map((item) => `${item.name}: ${item.quantity}`)} />
          <AnalyticsList title="Меньше всего продаж" items={analytics.leastProducts.map((item) => `${item.name}: ${item.quantity}`)} />
          <AnalyticsList title="Топ клиенты" items={analytics.customers.map((item) => `${item.name} ${item.phone}: ${formatPrice(item.spend)}`)} />
        </div>
      </section>

      <section className="section admin-section">
        <div className="section-heading">
          <p className="eyebrow">Товары</p>
          <h2>Добавить товар</h2>
        </div>
        <ProductForm categories={categories} />
      </section>

      <section className="section admin-section">
        <div className="section-heading">
          <p className="eyebrow">Клиенты</p>
          <h2>Customer list</h2>
        </div>
        <div className="admin-table">
          {users.map((user) => (
            <article className="admin-row" key={user.id}>
              <div>
                <h3>{user.name}</h3>
                <p>{user.phone} {user.email ? `- ${user.email}` : ""}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section admin-section">
        <div className="section-heading">
          <p className="eyebrow">Каталог</p>
          <h2>Товары</h2>
        </div>
        <div className="admin-table">
          {products.map((product) => (
            <article className="admin-row" key={product.id}>
              <img src={product.imageUrl} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.categoryName} - {formatPrice(product.price)} - stock: {product.stockQuantity}</p>
              </div>
              <ProductForm product={product} categories={categories} compact />
              <form action={removeProduct}>
                <input type="hidden" name="id" value={product.id} />
                <button className="danger-button" type="submit">Скрыть</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="section admin-section">
        <div className="section-heading">
          <p className="eyebrow">Categories</p>
          <h2>Категории</h2>
        </div>
        <form className="form-grid inline-form" action={saveCategory}>
          <input name="name" required placeholder="Название" />
          <input name="slug" placeholder="slug" />
          <input name="sortOrder" type="number" defaultValue="10" />
          <label className="checkbox-label"><input name="isActive" type="checkbox" defaultChecked /> Активна</label>
          <button className="primary-button" type="submit">Добавить</button>
        </form>
        <div className="admin-table">
          {categories.map((category) => (
            <article className="admin-row" key={category.id}>
              <div>
                <h3>{category.name}</h3>
                <p>{category.slug} - sort: {category.sortOrder}</p>
              </div>
              <form action={removeCategory}>
                <input type="hidden" name="id" value={category.id} />
                <button className="danger-button" type="submit">Удалить</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="section admin-section">
        <div className="section-heading">
          <p className="eyebrow">Заказы</p>
          <h2>Заказы</h2>
        </div>
        <div className="admin-table">
          {orders.length ? orders.map((order) => (
            <article className="admin-row" key={order.orderNumber}>
              <div>
                <h3>{order.orderNumber} - {formatPrice(order.total)}</h3>
                <p>{order.customerName}, {order.customerPhone}, {order.deliveryAddress}</p>
                <p>{order.items.map((item) => `${item.productName} x ${item.quantity}`).join(", ")}</p>
              </div>
              <form className="status-form" action={changeOrderStatus}>
                <input type="hidden" name="id" value={order.id} />
                <select name="status" defaultValue={order.status}>
                  {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button className="secondary-button" type="submit">Обновить</button>
              </form>
            </article>
          )) : (
            <div className="info-panel">
              <h3>Заказов пока нет</h3>
              <p>Оформите тестовый заказ через checkout, и он появится здесь.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section admin-section">
        <div className="section-heading">
          <p className="eyebrow">Промокоды</p>
          <h2>Промокоды</h2>
        </div>
        <form className="form-grid inline-form" action={savePromo}>
          <input name="code" required placeholder="WELCOME10" />
          <select name="type" defaultValue="percent">
            <option value="percent">Процент</option>
            <option value="fixed">Фиксированная сумма</option>
          </select>
          <input name="value" type="number" required placeholder="10" />
          <input name="minOrderAmount" type="number" defaultValue="0" placeholder="Мин. сумма" />
          <input name="maxUses" type="number" placeholder="Лимит" />
          <label className="checkbox-label"><input name="isActive" type="checkbox" defaultChecked /> Активен</label>
          <button className="primary-button" type="submit">Сохранить</button>
        </form>
        <div className="admin-table">
          {promos.map((promo) => (
            <article className="admin-row" key={promo.id}>
              <div>
                <h3>{promo.code}</h3>
                <p>{promo.type} {promo.value} - used: {promo.usedCount}</p>
              </div>
              <form action={removePromo}>
                <input type="hidden" name="id" value={promo.id} />
                <button className="danger-button" type="submit">Удалить</button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function AnalyticsList({ title, items }) {
  return (
    <div className="info-panel">
      <h3>{title}</h3>
      {items.length ? (
        <ul className="plain-list">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : (
        <p>Данных пока нет</p>
      )}
    </div>
  );
}

function ProductForm({ product, categories, compact = false }) {
  return (
    <details className={compact ? "edit-details" : ""} open={!compact}>
      {compact ? <summary>Редактировать</summary> : null}
      <form className="form-grid product-form" action={saveProduct}>
        <input type="hidden" name="id" value={product?.id ?? ""} />
        <label>
          Название
          <input name="name" required defaultValue={product?.name ?? ""} />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={product?.slug ?? ""} />
        </label>
        <label>
          Категория
          <select name="categoryId" required defaultValue={product?.categoryId ?? categories[0]?.id}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>
          Цена
          <input name="price" type="number" required defaultValue={product?.price ?? ""} />
        </label>
        <label>
          Старая цена
          <input name="oldPrice" type="number" defaultValue={product?.oldPrice ?? ""} />
        </label>
        <label>
          Stock
          <input name="stockQuantity" type="number" defaultValue={product?.stockQuantity ?? 0} />
        </label>
        <label>
          Image URL
          <input name="imageUrl" defaultValue={product?.imageUrl ?? ""} />
        </label>
        <label>
          Загрузить фото
          <input name="imageFile" type="file" accept="image/*" />
        </label>
        <label>
          Short description
          <input name="shortDescription" defaultValue={product?.shortDescription ?? ""} />
        </label>
        <label>
          Description
          <textarea name="description" required rows="3" defaultValue={product?.description ?? ""} />
        </label>
        <div className="check-grid">
          <label className="checkbox-label"><input name="isAvailable" type="checkbox" defaultChecked={product?.isAvailable ?? true} /> Доступен</label>
          <label className="checkbox-label"><input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured ?? false} /> Рекомендуемый</label>
          <label className="checkbox-label"><input name="isPopular" type="checkbox" defaultChecked={product?.isPopular ?? false} /> Популярный</label>
        </div>
        <button className="primary-button" type="submit">{product ? "Сохранить" : "Добавить товар"}</button>
      </form>
    </details>
  );
}
