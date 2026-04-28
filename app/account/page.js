import { getOrdersByPhone } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export default async function AccountPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const phone = params.phone ?? "";
  const orders = phone ? getOrdersByPhone(phone) : [];

  return (
    <main className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Account</p>
        <h1>Кабинет клиента</h1>
        <p className="intro">
          Пока без регистрации: клиент может найти свои заказы по номеру телефона.
        </p>
      </div>

      <form className="form-grid account-search">
        <label>
          Телефон
          <input name="phone" defaultValue={phone} placeholder="+374 ..." />
        </label>
        <button className="primary-button" type="submit">Показать заказы</button>
      </form>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Orders</p>
          <h2>История заказов</h2>
        </div>
        <div className="admin-table">
          {phone && !orders.length ? (
            <div className="info-panel">
              <h3>Заказы не найдены</h3>
              <p>Проверьте номер телефона или оформите новый заказ.</p>
            </div>
          ) : null}
          {orders.map((order) => (
            <article className="admin-row" key={order.id}>
              <div>
                <h3>{order.orderNumber} - {formatPrice(order.total)}</h3>
                <p>Статус: {order.status}</p>
                <p>{order.items.map((item) => `${item.productName} x ${item.quantity}`).join(", ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
