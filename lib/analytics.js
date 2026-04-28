import { db } from "@/lib/db";

export function getAnalytics() {
  const ordersByStatus = db
    .prepare("SELECT status, COUNT(*) AS count FROM orders GROUP BY status ORDER BY count DESC")
    .all();
  const topProducts = db
    .prepare(
      `SELECT product_name AS name, SUM(quantity) AS quantity, SUM(line_total) AS revenue
       FROM order_items GROUP BY product_id, product_name ORDER BY quantity DESC LIMIT 5`
    )
    .all();
  const leastProducts = db
    .prepare(
      `SELECT p.name, COALESCE(SUM(oi.quantity), 0) AS quantity
       FROM products p LEFT JOIN order_items oi ON oi.product_id = p.id
       WHERE p.is_available = 1
       GROUP BY p.id, p.name ORDER BY quantity ASC, p.name ASC LIMIT 5`
    )
    .all();
  const customers = db
    .prepare(
      `SELECT customer_phone AS phone, customer_name AS name, COUNT(*) AS orders, SUM(total) AS spend
       FROM orders GROUP BY customer_phone, customer_name ORDER BY spend DESC LIMIT 5`
    )
    .all();
  const today = db.prepare("SELECT COUNT(*) AS count, COALESCE(SUM(total), 0) AS revenue FROM orders WHERE date(created_at) = date('now')").get();
  const week = db.prepare("SELECT COUNT(*) AS count, COALESCE(SUM(total), 0) AS revenue FROM orders WHERE date(created_at) >= date('now', '-7 day')").get();
  const month = db.prepare("SELECT COUNT(*) AS count, COALESCE(SUM(total), 0) AS revenue FROM orders WHERE date(created_at) >= date('now', '-30 day')").get();

  return { ordersByStatus, topProducts, leastProducts, customers, today, week, month };
}
