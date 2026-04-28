import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-media">
        <img src={product.imageUrl} alt={product.name} />
        {product.oldPrice ? <span className="badge">Скидка</span> : null}
      </Link>
      <div className="product-body">
        <p className="product-category">{product.categoryName}</p>
        <h3>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <div>
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice ? <del>{formatPrice(product.oldPrice)}</del> : null}
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
