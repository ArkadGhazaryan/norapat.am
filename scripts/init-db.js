const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const dbDir = path.join(process.cwd(), "database");
const dbPath = path.join(dbDir, "norapat.db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_description TEXT,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    old_price INTEGER,
    image_url TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_available INTEGER NOT NULL DEFAULT 1,
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_popular INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'cash',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    status TEXT NOT NULL DEFAULT 'new',
    subtotal INTEGER NOT NULL,
    delivery_fee INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit_price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    line_total INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

const categories = [
  ["cat_pizza", "pizza", "Пицца", 1],
  ["cat_burger", "burger", "Бургеры", 2],
  ["cat_grill", "grill", "Гриль", 3],
  ["cat_salad", "salad", "Салаты", 4],
  ["cat_drink", "drink", "Напитки", 5],
];

const products = [
  ["prod_margherita", "cat_pizza", "margherita", "Пицца Маргарита", 2900, 3400, "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80", "Классическая пицца с томатным соусом, моцареллой, базиликом и тонким хрустящим тестом.", 18, 1],
  ["prod_pepperoni", "cat_pizza", "pepperoni", "Пицца Пепперони", 3600, null, "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80", "Насыщенная пицца с пепперони, сыром и фирменным соусом Norapat.", 12, 1],
  ["prod_classic_burger", "cat_burger", "classic-burger", "Классический бургер", 2400, 2900, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", "Сочная котлета, свежие овощи, сыр, соус и мягкая булочка с кунжутом.", 25, 1],
  ["prod_bbq_burger", "cat_burger", "bbq-burger", "BBQ бургер", 2800, null, "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80", "Бургер с BBQ соусом, карамелизированным луком, сыром и хрустящим салатом.", 15, 0],
  ["prod_chicken_grill", "cat_grill", "chicken-grill", "Курица гриль", 3900, 4500, "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=80", "Маринованная курица гриль с ароматными специями и гарниром на выбор.", 9, 1],
  ["prod_caesar", "cat_salad", "caesar", "Салат Цезарь", 2100, null, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80", "Свежий салат с курицей, пармезаном, сухариками и классическим соусом.", 20, 0],
  ["prod_lemonade", "cat_drink", "lemonade", "Домашний лимонад", 900, null, "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80", "Освежающий лимонад с лимоном, мятой и легкой сладостью.", 40, 0],
  ["prod_berry_drink", "cat_drink", "berry-drink", "Ягодный напиток", 1100, 1300, "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80", "Холодный ягодный напиток с насыщенным вкусом и натуральным сиропом.", 32, 1],
];

const insertCategory = db.prepare(
  `INSERT INTO categories (id, slug, name, sort_order)
   VALUES (?, ?, ?, ?)
   ON CONFLICT(slug) DO UPDATE SET name = excluded.name, sort_order = excluded.sort_order`
);

const insertProduct = db.prepare(
  `INSERT INTO products (
    id, category_id, slug, name, short_description, description, price,
    old_price, image_url, stock_quantity, is_popular
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(slug) DO UPDATE SET
    category_id = excluded.category_id,
    name = excluded.name,
    short_description = excluded.short_description,
    description = excluded.description,
    price = excluded.price,
    old_price = excluded.old_price,
    image_url = excluded.image_url,
    stock_quantity = excluded.stock_quantity,
    is_popular = excluded.is_popular`
);

for (const category of categories) {
  insertCategory.run(...category);
}

for (const product of products) {
  const [id, categoryId, slug, name, price, oldPrice, imageUrl, description, stockQuantity, isPopular] = product;
  insertProduct.run(id, categoryId, slug, name, description, description, price, oldPrice, imageUrl, stockQuantity, isPopular);
}

const productCount = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
const categoryCount = db.prepare("SELECT COUNT(*) AS count FROM categories").get().count;

db.close();

console.log(`Database ready: ${categoryCount} categories, ${productCount} products`);
