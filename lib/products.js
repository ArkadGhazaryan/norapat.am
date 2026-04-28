import { db } from "@/lib/db";

function mapProduct(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price,
    oldPrice: row.old_price,
    imageUrl: row.image_url,
    stockQuantity: row.stock_quantity,
    isAvailable: Boolean(row.is_available),
    isFeatured: Boolean(row.is_featured),
    isPopular: Boolean(row.is_popular),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getCategories() {
  return db
    .prepare(
      `SELECT id, slug, name, description, sort_order AS sortOrder, is_active AS isActive
       FROM categories
       WHERE is_active = 1
       ORDER BY sort_order ASC, name ASC`
    )
    .all();
}

export function getProducts({ category = "all", q = "", sort = "popular" } = {}) {
  const conditions = ["p.is_available = 1"];
  const values = {};

  if (category !== "all") {
    conditions.push("c.slug = $category");
    values.$category = category;
  }

  if (q) {
    conditions.push(
      "(LOWER(p.name) LIKE $query OR LOWER(p.description) LIKE $query OR LOWER(p.short_description) LIKE $query)"
    );
    values.$query = `%${q.toLowerCase()}%`;
  }

  const orderBy =
    sort === "price-asc"
      ? "p.price ASC"
      : sort === "price-desc"
        ? "p.price DESC"
        : sort === "newest"
          ? "p.created_at DESC"
          : "p.is_popular DESC, p.created_at DESC";

  const rows = db
    .prepare(
      `SELECT p.*, c.slug AS category_slug, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE ${conditions.join(" AND ")}
       ORDER BY ${orderBy}`
    )
    .all(values);

  return rows.map(mapProduct);
}

export function getProductBySlug(slug) {
  const row = db
    .prepare(
      `SELECT p.*, c.slug AS category_slug, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ? AND p.is_available = 1`
    )
    .get(slug);

  return row ? mapProduct(row) : null;
}

export function getRelatedProducts(product) {
  const rows = db
    .prepare(
      `SELECT p.*, c.slug AS category_slug, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.category_id = ? AND p.id != ? AND p.is_available = 1
       ORDER BY p.is_popular DESC, p.created_at DESC
       LIMIT 3`
    )
    .all(product.categoryId, product.id);

  return rows.map(mapProduct);
}

export function getProductSlugs() {
  return db.prepare("SELECT slug FROM products WHERE is_available = 1").all();
}
