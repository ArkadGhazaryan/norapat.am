import { getOrdersByPhone } from "@/lib/orders";
import { getAddresses, getCurrentUser, getWishlist } from "@/lib/users";
import { formatPrice } from "@/lib/format";
import {
  addCustomerAddress,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  saveCustomerProfile,
} from "@/app/account/actions";

export default async function AccountPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const user = await getCurrentUser();
  const phone = user?.phone ?? params.phone ?? "";
  const orders = phone ? getOrdersByPhone(phone) : [];
  const addresses = user ? getAddresses(user.id) : [];
  const wishlist = user ? getWishlist(user.id) : [];

  return (
    <main className="page-shell">
      <div className="page-heading admin-heading">
        <div>
          <p className="eyebrow">Кабинет</p>
          <h1>Кабинет клиента</h1>
          <p className="intro">Регистрация, профиль, адреса, история заказов и избранное.</p>
        </div>
        {user ? (
          <form action={logoutCustomer}>
            <button className="secondary-button" type="submit">Выйти</button>
          </form>
        ) : null}
      </div>

      {!user ? (
        <section className="account-grid">
          <form className="form-grid" action={loginCustomer}>
            <h2>Вход</h2>
            {params.error ? <p className="form-error">Неверный телефон или пароль</p> : null}
            <label>Телефон<input name="phone" required placeholder="+374 ..." /></label>
            <label>Пароль<input name="password" type="password" required /></label>
            <button className="primary-button" type="submit">Войти</button>
          </form>
          <form className="form-grid" action={registerCustomer}>
            <h2>Регистрация</h2>
            <label>Имя<input name="name" required /></label>
            <label>Телефон<input name="phone" required placeholder="+374 ..." /></label>
            <label>Email<input name="email" type="email" /></label>
            <label>Пароль<input name="password" type="password" required minLength="4" /></label>
            <button className="primary-button" type="submit">Создать аккаунт</button>
          </form>
        </section>
      ) : (
        <>
          <section className="account-grid">
            <form className="form-grid" action={saveCustomerProfile}>
              <h2>Профиль</h2>
              <label>Имя<input name="name" required defaultValue={user.name} /></label>
              <label>Телефон<input name="phone" required defaultValue={user.phone} /></label>
              <label>Email<input name="email" type="email" defaultValue={user.email ?? ""} /></label>
              <button className="primary-button" type="submit">Сохранить</button>
            </form>
            <form className="form-grid" action={addCustomerAddress}>
              <h2>Новый адрес</h2>
              <label>Название<input name="label" defaultValue="Дом" /></label>
              <label>Адрес<textarea name="address" required rows="3" /></label>
              <label className="checkbox-label"><input name="isDefault" type="checkbox" /> Основной</label>
              <button className="primary-button" type="submit">Добавить адрес</button>
            </form>
          </section>

          <section className="section">
            <div className="section-heading"><p className="eyebrow">Адреса</p><h2>Сохраненные адреса</h2></div>
            <div className="admin-table">
              {addresses.map((address) => (
                <article className="admin-row" key={address.id}>
                  <div><h3>{address.label}</h3><p>{address.address}</p></div>
                  {address.isDefault ? <strong>Основной</strong> : null}
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="section">
        <div className="section-heading"><p className="eyebrow">Заказы</p><h2>История заказов</h2></div>
        <div className="admin-table">
          {phone && !orders.length ? <div className="info-panel"><h3>Заказы не найдены</h3><p>Оформите заказ, и он появится здесь.</p></div> : null}
          {orders.map((order) => (
            <article className="admin-row" key={order.id}>
              <div><h3>{order.orderNumber} - {formatPrice(order.total)}</h3><p>Статус: {order.status}</p><p>{order.items.map((item) => `${item.productName} x ${item.quantity}`).join(", ")}</p></div>
            </article>
          ))}
        </div>
      </section>

      {user ? (
        <section className="section">
          <div className="section-heading"><p className="eyebrow">Избранное</p><h2>Wishlist</h2></div>
          <div className="admin-table">
            {wishlist.map((product) => (
              <article className="admin-row" key={product.id}>
                <img src={product.imageUrl} alt={product.name} />
                <div><h3>{product.name}</h3><p>{formatPrice(product.price)}</p></div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
