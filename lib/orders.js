import { db, createId } from "@/lib/db";

export const DELIVERY_FEE = 700;

export function createOrder({ customerName, customerPhone, customerEmail, deliveryAddress, paymentMethod, items }) {
  if (!items?.length) {
    throw new Error("Cart is empty");
  }

  const productStatement = db.prepare(
    "SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_available = 1"
  );

  const orderItems = items.map((item) => {
    const product = productStatement.get(item.id);
    if (!product) {
      throw new Error("Product is unavailable");
    }

    const quantity = Math.max(1, Number(item.quantity || 1));
    return {
      id: createId("item"),
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const orderId = createId("order");
  const orderNumber = "NP-" + Date.now().toString().slice(-6);

  const insertOrder = db.prepare(
    `INSERT INTO orders (
      id, order_number, customer_name, customer_phone, customer_email,
      delivery_address, payment_method, subtotal, delivery_fee, total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertItem = db.prepare(
    `INSERT INTO order_items (
      id, order_id, product_id, product_name, unit_price, quantity, line_total
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  db.exec("BEGIN");
  try {
    insertOrder.run(
      orderId,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail || null,
      deliveryAddress,
      paymentMethod || "cash",
      subtotal,
      deliveryFee,
      total
    );

    for (const item of orderItems) {
      insertItem.run(
        item.id,
        orderId,
        item.productId,
        item.productName,
        item.unitPrice,
        item.quantity,
        item.lineTotal
      );
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return getOrderById(orderId);
}

export function getOrderById(id) {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  if (!order) return null;
  return mapOrder(order, getOrderItems(id));
}

export function getOrders() {
  const orders = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all();

  return orders.map((order) => mapOrder(order, getOrderItems(order.id)));
}

function getOrderItems(orderId) {
  return db
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(orderId)
    .map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      lineTotal: item.line_total,
    }));
}

function mapOrder(order, items) {
  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    customerEmail: order.customer_email,
    deliveryAddress: order.delivery_address,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    status: order.status,
    subtotal: order.subtotal,
    deliveryFee: order.delivery_fee,
    total: order.total,
    createdAt: order.created_at,
    items,
  };
}
