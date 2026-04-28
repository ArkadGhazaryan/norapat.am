# Требования Norapat.am Shop

## 1. Статус требований

Этот документ фиксирует финальные требования для текущей локальной версии Norapat.am Shop.

Источник первоначальных требований: `Shop - Norapat - code.md`.

Текущий статус: требования подтверждены для local functional shop.

## 2. Цель проекта

Norapat.am должен работать как интернет-магазин фудкорта:

- показывать каталог товаров;
- позволять клиенту искать, фильтровать и сортировать товары;
- позволять добавлять товары в корзину;
- оформлять заказ;
- сохранять заказ в database;
- давать администратору управление товарами, категориями, заказами и промокодами;
- показывать базовую аналитику.

## 3. Final database requirements

Для текущей local версии используется SQLite database:

- database file: `database/norapat.db`;
- initialization command: `npm.cmd run db:init`;
- server database layer: `lib/db.js`;
- product queries: `lib/products.js`;
- order queries: `lib/orders.js`;
- promo queries: `lib/promos.js`.

Final local schema:

- `categories`
- `products`
- `orders`
- `order_items`
- `promo_codes`

Production migration requirement:

- later database can be moved to Supabase or Neon PostgreSQL;
- same entities must be preserved;
- admin CRUD and checkout must continue to use server-side database writes.

## 4. Payment requirements

Current required payment method:

- cash on delivery.

Current online payment decision:

- online payment is not required for the current local version;
- online payment must stay disabled in UI until provider is selected.

Future provider options:

- Idram;
- ArCa;
- bank payment gateway.

Online payment can be started only after business chooses provider credentials and callback rules.

## 5. Delivery requirements

Current delivery rule:

- fixed delivery fee: `700 AMD`.

Checkout must show:

- products subtotal;
- promo discount, if applied;
- delivery fee;
- final total.

Future delivery expansion:

- delivery zones;
- free delivery from selected order amount;
- delivery time slots;
- admin-editable delivery settings.

## 6. Design requirements

Current design direction:

- clean food commerce interface;
- restrained warm background;
- red brand accent;
- green support color;
- white product cards;
- 8px border radius;
- responsive grid layout;
- Russian visible UI text;
- clear buttons and forms;
- focus states for keyboard accessibility;
- hover states for clickable cards and buttons.

Required core UI:

- global header;
- navigation;
- cart indicator;
- footer links;
- home hero;
- category grid;
- product cards;
- shop filters;
- cart list;
- checkout form;
- admin forms and tables;
- account order lookup.

## 7. Product and category data requirements

Current seed data:

Categories:

- Пицца
- Бургеры
- Гриль
- Салаты
- Напитки

Seed products:

- Пицца Маргарита
- Пицца Пепперони
- Классический бургер
- BBQ бургер
- Курица гриль
- Салат Цезарь
- Домашний лимонад
- Ягодный напиток

Admin requirements:

- admin can add product;
- admin can edit product;
- admin can hide product;
- admin can add category;
- admin can delete empty category;
- admin can manage promo codes.

## 8. Functional requirements

Public shop:

- home page;
- shop page;
- product detail page;
- category filter;
- search;
- sorting by popular, newest, price asc, price desc.

Cart:

- add to cart;
- remove from cart;
- update quantity;
- show subtotal;
- show delivery fee;
- show total.

Checkout:

- customer name;
- phone;
- optional email;
- delivery address;
- payment method;
- promo code;
- server-side order creation;
- order confirmation number.

Customer account:

- customer can search orders by phone number;
- order history shows order number, status, total and items.

Admin:

- admin login required;
- product management;
- category management;
- order list;
- order status update;
- promo code management;
- revenue statistics;
- average order value.

## 9. Security requirements

Current local admin security:

- admin page is protected by password;
- admin session uses httpOnly cookie;
- default local password is defined by `ADMIN_PASSWORD`.

Production security requirements:

- replace default password;
- use HTTPS;
- store secrets in hosting environment variables;
- add full customer authentication only when customer accounts become required.

## 10. Acceptance criteria

EPIC 03 is considered complete when:

- requirements document exists;
- project modules are described;
- database schema is confirmed;
- payment requirement is decided for current version;
- delivery rule is documented;
- design requirements are documented;
- product/category seed data is documented.

All criteria are complete in this document.
