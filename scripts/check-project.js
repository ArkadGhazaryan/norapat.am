const fs = require("node:fs");
const path = require("node:path");

const requiredPaths = [
  "app/layout.js",
  "app/page.js",
  "app/shop/page.js",
  "app/checkout/page.js",
  "app/admin/page.js",
  "app/api/orders/route.js",
  "components/cart/CartProvider.js",
  "lib/db.js",
  "lib/orders.js",
  "lib/products.js",
  "scripts/init-db.js",
  ".env.example",
  "jsconfig.json",
];

const missing = requiredPaths.filter((entry) => {
  return !fs.existsSync(path.join(process.cwd(), entry));
});

if (missing.length) {
  console.error("Project check failed. Missing files:");
  for (const entry of missing) {
    console.error(`- ${entry}`);
  }
  process.exit(1);
}

console.log(`Project check passed: ${requiredPaths.length} required files found.`);
