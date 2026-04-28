import Link from "next/link";
import { getCategories, getProducts } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

export default async function Home() {
  const categories = getCategories();
  const popular = getProducts({ sort: "popular" }).slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Norapat.am</p>
          <h1>Готовая еда, быстрый заказ и удобная доставка</h1>
          <p className="intro">
            Полноценный локальный магазин: каталог, карточки товаров, корзина,
            оформление заказа, кабинет клиента и админ-панель для управления.
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
            <Link key={category.id} href={`/shop?category=${category.slug}`}>
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
