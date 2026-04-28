import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductCard } from "@/components/shop/ProductCard";

export function generateStaticParams() {
  return getProductSlugs().map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  return (
    <main className="page-shell">
      <Link className="secondary-button" href="/shop">Назад в магазин</Link>
      <section className="product-detail section">
        <img src={product.imageUrl} alt={product.name} />
        <div>
          <p className="eyebrow">{product.categoryName}</p>
          <h1>{product.name}</h1>
          <p className="intro">{product.description}</p>
          <div className="price-line">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice ? <del>{formatPrice(product.oldPrice)}</del> : null}
          </div>
          <p>Статус: {product.stockQuantity > 0 ? `В наличии (${product.stockQuantity})` : "Нет в наличии"}</p>
          <div className="hero-actions">
            <AddToCartButton product={product} label="Добавить в корзину" />
            <Link className="secondary-button" href="/cart">Перейти в корзину</Link>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Похожие товары</p>
            <h2>Можно добавить к заказу</h2>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
