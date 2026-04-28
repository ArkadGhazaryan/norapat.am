import { createId, db } from "@/lib/db";

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

export function getAllCategories() {
  return db
    .prepare(
      `SELECT id, slug, name, description, sort_order AS sortOrder, is_active AS isActive
       FROM categories
       ORDER BY sort_order ASC, name ASC`
    )
    .all()
    .map((category) => ({ ...category, isActive: Boolean(category.isActive) }));
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

export function getProductById(id) {
  const row = db
    .prepare(
      `SELECT p.*, c.slug AS category_slug, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`
    )
    .get(id);
  return row ? mapProduct(row) : null;
}

export function upsertCategory(data) {
  const id = data.id || createId("cat");
  db.prepare(
    `INSERT INTO categories (id, slug, name, description, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
       name = excluded.name,
       description = excluded.description,
       sort_order = excluded.sort_order,
       is_active = excluded.is_active,
       updated_at = CURRENT_TIMESTAMP`
  ).run(
    id,
    slugify(data.slug || data.name),
    data.name,
    data.description || null,
    Number(data.sortOrder || 0),
    data.isActive ? 1 : 0
  );
}

export function deleteCategory(id) {
  const productCount = db
    .prepare("SELECT COUNT(*) AS count FROM products WHERE category_id = ?")
    .get(id).count;
  if (productCount > 0) {
    throw new Error("Category has products");
  }
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}

export function upsertProduct(data) {
  const id = data.id || createId("prod");
  db.prepare(
    `INSERT INTO products (
      id, category_id, slug, name, short_description, description, price,
      old_price, image_url, stock_quantity, is_available, is_featured, is_popular
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      category_id = excluded.category_id,
      name = excluded.name,
      short_description = excluded.short_description,
      description = excluded.description,
      price = excluded.price,
      old_price = excluded.old_price,
      image_url = excluded.image_url,
      stock_quantity = excluded.stock_quantity,
      is_available = excluded.is_available,
      is_featured = excluded.is_featured,
      is_popular = excluded.is_popular,
      updated_at = CURRENT_TIMESTAMP`
  ).run(
    id,
    data.categoryId,
    slugify(data.slug || data.name),
    data.name,
    data.shortDescription || data.description,
    data.description,
    Number(data.price),
    data.oldPrice ? Number(data.oldPrice) : null,
    data.imageUrl,
    Number(data.stockQuantity || 0),
    data.isAvailable ? 1 : 0,
    data.isFeatured ? 1 : 0,
    data.isPopular ? 1 : 0
  );
}

export function deleteProduct(id) {
  db.prepare("UPDATE products SET is_available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
}

export function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
