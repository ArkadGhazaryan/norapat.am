import Link from "next/link";
import { countProducts, getCategories, getProducts } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

export default async function ShopPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const query = (params.q ?? "").toLowerCase();
  const category = params.category ?? "all";
  const sort = params.sort ?? "popular";
  const availability = params.availability ?? "all";
  const page = Math.max(1, Number(params.page ?? 1));
  const categories = getCategories();
  const pageSize = 6;
  const filtered = getProducts({ category, q: query, sort, availability, page, pageSize });
  const total = countProducts({ category, q: query, availability });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

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
          <label>
            Наличие
            <select name="availability" defaultValue={availability}>
              <option value="all">Все товары</option>
              <option value="in-stock">В наличии</option>
              <option value="out-of-stock">Нет в наличии</option>
            </select>
          </label>
          <button className="primary-button" type="submit">Применить</button>
        </form>

        <div>
          <div className="section-heading">
            <p>{total} товаров найдено</p>
          </div>
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="pagination">
            {Array.from({ length: pageCount }, (_, index) => {
              const pageNumber = index + 1;
              const href = `/shop?category=${category}&q=${encodeURIComponent(query)}&sort=${sort}&availability=${availability}&page=${pageNumber}`;
              return (
                <Link className={pageNumber === page ? "active-page" : ""} href={href} key={pageNumber}>
                  {pageNumber}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
