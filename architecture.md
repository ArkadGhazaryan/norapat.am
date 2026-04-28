# Архитектура Norapat.am Shop

## 1. Цель проекта

Norapat.am - это e-commerce приложение для Foodcourt, в котором должны быть публичный магазин, система аккаунтов клиентов, оформление заказа, админ-панель, аналитика и управление заказами.

Проект должен быть готовым к production, быстрым, SEO-friendly, адаптивным и удобным для дальнейшей поддержки.

## 2. Текущее состояние проекта

В репозитории уже есть стартовый Next.js проект.

Текущий tech stack:

- Next.js `16.2.4`
- React `19.2.5`
- React DOM `19.2.5`
- App Router structure `app/`
- Global CSS `app/globals.css`
- Main page `app/page.js`
- Root layout `app/layout.js`

На данный момент в проекте нет database, authentication, admin panel, API layer и payment integration.

## 3. Рекомендуемый финальный tech stack

### Frontend

- Next.js App Router
- React Server Components для загрузки данных на сервере
- Client Components для интерактивных частей: cart, filters, forms
- CSS Modules или Tailwind CSS
- lucide-react icons для UI buttons

### Backend

- Next.js Route Handlers `app/api/...`
- Server Actions, если workflow формы простой
- Zod для validation request/body/form
- Role-based access для admin и customer частей

### Database

Рекомендуется использовать PostgreSQL.

Причины:

- хорошо подходит для relational данных: orders, products, customers
- production-ready
- удобно масштабируется
- хорошо работает с Prisma ORM
- можно хостить на Supabase, Neon, Railway или Render

Рекомендуемый ORM:

- Prisma ORM

Рекомендуемый database provider для development:

- Local PostgreSQL или Supabase free project

Рекомендуемый database provider для production:

- Supabase или Neon PostgreSQL

## 4. Authentication и roles

Рекомендуется использовать Auth.js или NextAuth.

Roles:

- `customer` - может войти в аккаунт, смотреть свои orders, хранить profile data
- `admin` - может управлять products, categories, orders, discounts, analytics

Login options:

- Email + password
- Phone number, если нужен SMS provider
- Social login только если это нужно бизнесу

Security requirements:

- hashed passwords
- protected admin routes
- CSRF-safe form workflows
- server-side permission checks
- input validation во всех API

## 5. High-level modules

### 5.1 Public home page

Home page должен представлять Norapat brand и основные возможности shop.

Должно быть:

- hero section
- category highlights
- new products
- popular products
- promo/discount area
- footer с contact data
- social links
- search entry point

### 5.2 Shop page

Shop page - основная страница каталога.

Должно быть:

- product grid
- categories
- search
- filters by category, price, availability
- sorting by price asc/desc
- sorting by newest
- sorting by popular
- pagination или infinite load

### 5.3 Single product page

Product detail page должен показывать всю нужную информацию о товаре.

Должно быть:

- product image gallery
- zoom
- title
- short description
- full description
- current price
- old price, если есть
- discount price
- stock status
- quantity selector
- add to cart
- wishlist action
- related products

### 5.4 Cart

Cart должен работать сначала client-side, но во время checkout цены и наличие должны проверяться server-side.

Должно быть:

- cart item list
- quantity update
- item remove
- subtotal
- discount
- delivery fee
- total price
- promo code apply

### 5.5 Checkout

Checkout должен быть простым и быстрым.

Должно быть:

- customer name
- phone
- email, optional или required по бизнес-логике
- delivery address
- delivery method
- payment method
- order note
- promo code
- order summary
- final submit

Payment methods:

- Cash on delivery
- Online payment integration, например Idram, bank gateway или ArCa provider

### 5.6 Customer profile

Customer profile должен быть доступен после login.

Должно быть:

- registration
- login
- logout
- profile edit
- saved addresses
- order history
- order detail
- reorder action
- wishlist

### 5.7 Admin panel

Admin panel - это management system проекта.

Должно быть:

- admin dashboard
- product create/edit/delete
- product image upload
- category create/edit/delete
- order list
- order filters by status
- order detail
- order status update
- customer list
- promo code management
- analytics

Order statuses:

- `new`
- `confirmed`
- `preparing`
- `delivering`
- `completed`
- `cancelled`

### 5.8 Analytics

Analytics должен показывать важные business data.

Должно быть:

- total orders
- total revenue
- average order value
- orders by status
- today / week / month filters
- top 5 best-selling products
- least-selling products
- new customers
- repeat orders
- top customers by spend

### 5.9 Static pages

Нужно добавить:

- About us
- Contact
- Privacy Policy
- Terms & Conditions
- Refund Policy
- Delivery Policy

## 6. Рекомендуемая database schema

### User

Хранит customer и admin users.

Fields:

- id
- name
- email
- phone
- passwordHash
- role
- createdAt
- updatedAt

### Address

Хранит delivery addresses клиента.

Fields:

- id
- userId
- city
- street
- building
- apartment
- notes
- isDefault
- createdAt

### Category

Хранит product categories.

Fields:

- id
- name
- slug
- description
- imageUrl
- isActive
- sortOrder
- createdAt
- updatedAt

### Product

Хранит товары магазина.

Fields:

- id
- categoryId
- name
- slug
- shortDescription
- description
- price
- oldPrice
- discountPrice
- stockQuantity
- isAvailable
- isFeatured
- isPopular
- createdAt
- updatedAt

### ProductImage

Хранит product gallery images.

Fields:

- id
- productId
- url
- alt
- sortOrder
- createdAt

### WishlistItem

Хранит избранные товары пользователя.

Fields:

- id
- userId
- productId
- createdAt

### Cart

Используется, если cart нужно хранить на сервере.

Fields:

- id
- userId
- sessionId
- createdAt
- updatedAt

### CartItem

Fields:

- id
- cartId
- productId
- quantity
- createdAt
- updatedAt

### PromoCode

Fields:

- id
- code
- type
- value
- minOrderAmount
- startsAt
- expiresAt
- maxUses
- usedCount
- isActive
- createdAt

### Order

Fields:

- id
- userId
- orderNumber
- customerName
- customerPhone
- customerEmail
- deliveryAddress
- deliveryMethod
- paymentMethod
- paymentStatus
- status
- subtotal
- discountTotal
- deliveryFee
- total
- notes
- createdAt
- updatedAt

### OrderItem

Fields:

- id
- orderId
- productId
- productName
- unitPrice
- quantity
- lineTotal

### Payment

Для online payment.

Fields:

- id
- orderId
- provider
- providerPaymentId
- amount
- currency
- status
- rawResponse
- createdAt
- updatedAt

## 7. File structure

Рекомендуемая structure:

```text
app/
  page.js
  layout.js
  globals.css
  shop/
    page.js
  product/
    [slug]/
      page.js
  cart/
    page.js
  checkout/
    page.js
  account/
    page.js
    orders/
      page.js
  admin/
    page.js
    products/
      page.js
    categories/
      page.js
    orders/
      page.js
    analytics/
      page.js
  api/
    products/
      route.js
    orders/
      route.js
    auth/
      [...nextauth]/
        route.js
components/
  layout/
  shop/
  cart/
  checkout/
  admin/
lib/
  db.js
  auth.js
  validations.js
  money.js
prisma/
  schema.prisma
  seed.js
public/
  images/
```

## 8. Реализация шаг за шагом

### Phase 1 - Project base

1. Очистить starter UI и сделать global layout.
2. Добавить header, footer, navigation.
3. Определить design system: colors, typography, spacing.
4. Добавить reusable components.
5. Добавить example file для environment variables.

### Phase 2 - Database и Prisma

1. Установить Prisma и PostgreSQL client.
2. Создать `prisma/schema.prisma`.
3. Описать tables.
4. Запустить migration.
5. Создать seed script для categories/products.
6. Создать `lib/db.js`.

### Phase 3 - Public catalog

1. Сделать home page.
2. Сделать shop page.
3. Сделать product cards.
4. Сделать product detail page.
5. Добавить filters.
6. Добавить sorting.
7. Добавить search.

### Phase 4 - Cart и checkout

1. Сделать cart state management.
2. Добавить add/remove/update quantity.
3. Проверять cart items server-side во время checkout.
4. Сделать checkout form.
5. Создать order в database.
6. Добавить cash payment method.
7. Добавить online payment integration, если provider выбран.

### Phase 5 - Authentication и account

1. Установить Auth.js/NextAuth.
2. Сделать registration.
3. Сделать login.
4. Сделать protected account pages.
5. Сделать order history.
6. Сделать saved addresses.
7. Сделать wishlist.

### Phase 6 - Admin panel

1. Сделать admin route protection.
2. Сделать dashboard layout.
3. Сделать product management.
4. Сделать category management.
5. Сделать order management.
6. Сделать promo code management.
7. Сделать image upload workflow.

### Phase 7 - Analytics

1. Считать total orders.
2. Считать total revenue.
3. Считать average order value.
4. Показывать order statuses.
5. Показывать top products.
6. Показывать customer analytics.

### Phase 8 - Static pages и legal

1. Сделать about page.
2. Сделать contact page.
3. Сделать privacy policy.
4. Сделать terms and conditions.
5. Сделать refund policy.
6. Сделать delivery policy.

### Phase 9 - Testing и production

1. Проверить все forms.
2. Проверить checkout flow.
3. Проверить admin permissions.
4. Проверить mobile responsive UI.
5. Запустить build.
6. Настроить production database.
7. Deploy через Vercel/Supabase или Vercel/Neon stack.

## 9. Environment variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
PAYMENT_PROVIDER=
PAYMENT_CLIENT_ID=
PAYMENT_CLIENT_SECRET=
UPLOAD_PROVIDER=
UPLOAD_SECRET=
```

## 10. Recommended tools

- Next.js - application framework
- React - UI
- PostgreSQL - database
- Prisma - ORM и migrations
- Auth.js/NextAuth - authentication
- Zod - validation
- bcrypt - password hashing
- lucide-react - icons
- Vercel - hosting
- Supabase или Neon - managed PostgreSQL
- Cloudinary или UploadThing - image uploads

## 11. Definition of done

Проект можно считать завершенным, когда:

- user может browse products
- user может search/filter/sort catalog
- user может add to cart
- user может checkout
- order сохраняется в database
- admin может управлять product/order/category
- analytics считается из real data
- authentication работает
- build проходит без errors
- mobile и desktop UI usable
