import { db, createId } from "@/lib/db";
import { calculatePromoDiscount, incrementPromoUse } from "@/lib/promos";

export const DELIVERY_FEE = 700;

export function createOrder({ customerName, customerPhone, customerEmail, deliveryAddress, paymentMethod, promoCode, items }) {
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
  const { discount } = calculatePromoDiscount(promoCode, subtotal);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal - discount + deliveryFee;
  const orderId = createId("order");
  const orderNumber = "NP-" + Date.now().toString().slice(-6);

  const paymentStatus = paymentMethod === "card" ? "paid" : "pending";
  const insertOrder = db.prepare(
    `INSERT INTO orders (
      id, order_number, customer_name, customer_phone, customer_email,
      delivery_address, payment_method, payment_status, subtotal, delivery_fee, total, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      paymentStatus,
      subtotal,
      deliveryFee,
      total,
      promoCode ? `Promo: ${promoCode.toUpperCase()} discount ${discount}` : null
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

    if (paymentMethod === "card") {
      db.prepare("INSERT INTO payments (id, order_id, provider, amount, status) VALUES (?, ?, ?, ?, ?)").run(
        createId("pay"),
        orderId,
        "simulated-card",
        total,
        "paid"
      );
    }

    db.exec("COMMIT");
    if (promoCode && discount > 0) {
      incrementPromoUse(promoCode);
    }
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

export function getOrdersByPhone(phone) {
  const orders = db
    .prepare("SELECT * FROM orders WHERE customer_phone = ? ORDER BY created_at DESC")
    .all(phone);

  return orders.map((order) => mapOrder(order, getOrderItems(order.id)));
}

export function updateOrderStatus(id, status) {
  db.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
  return getOrderById(id);
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
