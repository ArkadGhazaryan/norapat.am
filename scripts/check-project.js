const fs = require("node:fs");
const path = require("node:path");

const requiredPaths = [
  "app/layout.js",
  "app/page.js",
  "app/shop/page.js",
  "app/checkout/page.js",
  "app/admin/page.js",
  "app/account/actions.js",
  "app/api/orders/route.js",
  "app/api/promos/route.js",
  "components/cart/CartProvider.js",
  "components/shop/WishlistButton.js",
  "lib/db.js",
  "lib/analytics.js",
  "lib/orders.js",
  "lib/products.js",
  "lib/users.js",
  "lib/promos.js",
  "scripts/init-db.js",
  "requirements.md",
  "deployment.md",
  "vercel.json",
  "scripts/qa.js",
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
