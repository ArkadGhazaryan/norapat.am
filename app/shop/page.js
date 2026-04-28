import { getCategories, getProducts } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

export default async function ShopPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const query = (params.q ?? "").toLowerCase();
  const category = params.category ?? "all";
  const sort = params.sort ?? "popular";
  const categories = getCategories();
  const filtered = getProducts({ category, q: query, sort });

  return (
    <main className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Магазин</p>
        <h1>Каталог Norapat</h1>
        <p className="intro">
          Фильтруйте блюда по категории, ищите по названию и добавляйте товары в корзину.
        </p>
      </div>

      <div className="shop-layout">
        <form className="filters">
          <label>
            Поиск
            <input name="q" placeholder="Пицца, бургер..." defaultValue={params.q ?? ""} />
          </label>
          <label>
            Категория
            <select name="category" defaultValue={category}>
              <option value="all">Все категории</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Сортировка
            <select name="sort" defaultValue={sort}>
              <option value="popular">Популярные</option>
              <option value="newest">Новые</option>
              <option value="price-asc">Цена по возрастанию</option>
              <option value="price-desc">Цена по убыванию</option>
            </select>
          </label>
          <button className="primary-button" type="submit">Применить</button>
        </form>

        <div>
          <div className="section-heading">
            <p>{filtered.length} товаров найдено</p>
          </div>
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
