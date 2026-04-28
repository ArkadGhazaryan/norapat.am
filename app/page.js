import Link from "next/link";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";

export default function Home() {
  const popular = products.filter((product) => product.popular).slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Norapat.am</p>
          <h1>Готовая еда, быстрый заказ и удобная доставка</h1>
          <p className="intro">
            Рабочий MVP магазина: каталог, карточки товаров, корзина,
            checkout, аккаунт и админ-панель для управления заказами.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/shop">Открыть магазин</Link>
            <Link className="secondary-button" href="/admin">Админ-панель</Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
            alt="Готовые блюда Norapat"
          />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Категории</p>
          <h2>Выберите раздел</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.id}`}>
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Популярное</p>
          <h2>Часто заказывают</h2>
        </div>
        <div className="product-grid">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
