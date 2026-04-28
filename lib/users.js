import crypto from "node:crypto";
import { cookies } from "next/headers";
import { createId, db } from "@/lib/db";

const CUSTOMER_COOKIE = "norapat_customer";

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  return hashPassword(password, salt) === `${salt}:${hash}`;
}

export function createUser({ name, email, phone, password }) {
  const id = createId("user");
  db.prepare(
    `INSERT INTO users (id, name, email, phone, password_hash)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, name, email || null, phone, hashPassword(password));
  return getUserById(id);
}

export function loginUser({ phone, password }) {
  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  if (!user || !verifyPassword(password, user.password_hash)) return null;
  return mapUser(user);
}

export function getUserById(id) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return user ? mapUser(user) : null;
}

export function getUsers() {
  return db.prepare("SELECT * FROM users ORDER BY created_at DESC").all().map(mapUser);
}

export function updateUser(id, { name, email, phone }) {
  db.prepare(
    "UPDATE users SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(name, email || null, phone, id);
  return getUserById(id);
}

export async function setCustomerSession(userId) {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(CUSTOMER_COOKIE)?.value;
  return userId ? getUserById(userId) : null;
}

export function getAddresses(userId) {
  return db
    .prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC")
    .all(userId)
    .map((row) => ({
      id: row.id,
      label: row.label,
      address: row.address,
      isDefault: Boolean(row.is_default),
    }));
}

export function saveAddress(userId, { label, address, isDefault }) {
  const id = createId("addr");
  if (isDefault) {
    db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(userId);
  }
  db.prepare(
    "INSERT INTO addresses (id, user_id, label, address, is_default) VALUES (?, ?, ?, ?, ?)"
  ).run(id, userId, label || "Основной", address, isDefault ? 1 : 0);
}

export function getWishlist(userId) {
  return db
    .prepare(
      `SELECT p.*, c.slug AS category_slug, c.name AS category_name
       FROM wishlist_items w
       JOIN products p ON p.id = w.product_id
       JOIN categories c ON c.id = p.category_id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`
    )
    .all(userId)
    .map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      categorySlug: row.category_slug,
      categoryName: row.category_name,
      slug: row.slug,
      name: row.name,
      description: row.description,
      price: row.price,
      oldPrice: row.old_price,
      imageUrl: row.image_url,
      stockQuantity: row.stock_quantity,
      isAvailable: Boolean(row.is_available),
      isPopular: Boolean(row.is_popular),
    }));
}

export function toggleWishlist(userId, productId) {
  const existing = db
    .prepare("SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?")
    .get(userId, productId);
  if (existing) {
    db.prepare("DELETE FROM wishlist_items WHERE id = ?").run(existing.id);
    return false;
  }
  db.prepare("INSERT INTO wishlist_items (id, user_id, product_id) VALUES (?, ?, ?)").run(
    createId("wish"),
    userId,
    productId
  );
  return true;
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
  };
}
