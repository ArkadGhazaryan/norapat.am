# Прогресс Norapat.am

## Общий статус проекта

Общий progress реализации проекта на данный момент: `78%`.

Сайт уже работает как functional local shop: есть home page, shop, product detail, cart, checkout, server API, local SQLite database, protected admin panel, product/category CRUD, order status management, promo codes, customer order lookup и static/legal pages. Online payment, real file upload, full customer registration и production deployment еще не подключены.

## Общая статистика по epic-ам

| Epic | Progress | Tasks done | Status |
| --- | ---: | ---: | --- |
| EPIC 01 - Project setup | 90% | 8 / 9 | Mostly done |
| EPIC 02 - Basic UI and layout | 80% | 8 / 10 | MVP done |
| EPIC 03 - Requirements document | 70% | 2 / 7 | Draft exists |
| EPIC 04 - Architecture document | 100% | 8 / 8 | Done |
| EPIC 05 - Database | 65% | 7 / 11 | Local SQLite done |
| EPIC 06 - Authentication | 55% | 6 / 10 | Admin auth done |
| EPIC 07 - Public shop | 85% | 9 / 11 | MVP done |
| EPIC 08 - Cart | 85% | 7 / 8 | LocalStorage MVP |
| EPIC 09 - Checkout | 90% | 9 / 10 | Server order + promo |
| EPIC 10 - Customer profile | 45% | 4 / 8 | Order lookup done |
| EPIC 11 - Admin panel | 85% | 10 / 12 | CRUD/admin protection done |
| EPIC 12 - Analytics | 55% | 5 / 9 | Basic DB analytics |
| EPIC 13 - Static/legal pages | 80% | 7 / 9 | Draft pages |
| EPIC 14 - Testing and deployment | 45% | 4 / 9 | Build passed |

## EPIC 01 - Project setup | Epic progress: 90% | Tasks: 8 / 9 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать `package.json` | 100% | Done | Файл существует |
| Установить Next.js | 100% | Done | Next.js `16.2.4` |
| Установить React | 100% | Done | React `19.2.5` |
| Создать `next.config.mjs` | 100% | Done | Файл существует |
| Создать `package-lock.json` | 100% | Done | Файл существует |
| Создать `app/` structure | 100% | Done | Routes добавлены |
| Добавить `jsconfig.json` | 100% | Done | `@/` imports работают |
| Добавить `.env.example` | 100% | Done | Basic env keys добавлены |
| Добавить lint/test scripts | 0% | Not started | Пока есть только build verification |

## EPIC 02 - Basic UI and layout | Epic progress: 80% | Tasks: 8 / 10 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать global layout | 100% | Done | `app/layout.js` обновлен |
| Создать header | 100% | Done | `components/layout/Header.js` |
| Создать footer | 100% | Done | `components/layout/Footer.js` |
| Сделать navigation | 100% | Done | Home/shop/account/admin/cart |
| Сделать home page | 100% | Done | Hero, categories, popular products |
| Добавить responsive styles | 90% | Done | Mobile grid/layout rules есть |
| Добавить product visuals | 100% | Done | Product images используются |
| Добавить reusable buttons/cards | 80% | Done | ProductCard/AddToCartButton |
| Финальный brand design | 40% | Partial | MVP style есть, brand нужно уточнить |
| Финальный Armenian/Russian content | 40% | Partial | Сейчас основной UI на русском |

## EPIC 03 - Requirements document | Epic progress: 70% | Tasks: 2 / 7 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать requirements document | 100% | Done | Есть `Shop - Norapat - code.md` |
| Описать основные modules | 100% | Done | Home/shop/product/checkout/profile/admin |
| Подтвердить final database schema | 0% | Not started | Нужно business confirmation |
| Выбрать payment provider | 0% | Not started | Idram/ArCa/bank не выбран |
| Описать delivery rules | 20% | Partial | В MVP фиксированная доставка 700 AMD |
| Уточнить exact design requirements | 0% | Not started | Нужны brand references |
| Добавить real product/category data | 20% | Partial | Есть sample data |

## EPIC 04 - Architecture document | Epic progress: 100% | Tasks: 8 / 8 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать `architecture.md` | 100% | Done | Файл создан |
| Описать цель проекта | 100% | Done | Есть project goal |
| Описать current stack | 100% | Done | Next.js/React/current files |
| Описать recommended stack | 100% | Done | Frontend/backend/tools |
| Описать database choice | 100% | Done | PostgreSQL + Prisma |
| Описать schema proposal | 100% | Done | User/Product/Order/etc. |
| Описать file structure | 100% | Done | Recommended tree |
| Описать implementation phases | 100% | Done | Phase 1-9 |

## EPIC 05 - Database | Epic progress: 65% | Tasks: 7 / 11 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать local SQLite database | 100% | Done | `database/norapat.db` создается через script |
| Создать database init script | 100% | Done | `scripts/init-db.js` |
| Создать server DB helper | 100% | Done | `lib/db.js` |
| Создать Product/Category tables | 100% | Done | SQLite tables |
| Создать Order/OrderItem tables | 100% | Done | SQLite tables |
| Seed categories/products | 100% | Done | 5 categories, 8 products |
| Создать products query layer | 100% | Done | `lib/products.js` |
| Создать PromoCode model | 0% | Not started | Нет |
| Создать User model | 0% | Not started | Нет |
| Подключить production PostgreSQL | 0% | Not started | Supabase/Neon позже |
| Добавить migration workflow | 0% | Not started | Сейчас init script, не migration system |

## EPIC 06 - Authentication | Epic progress: 55% | Tasks: 6 / 10 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать account page | 100% | Done | `/account` page есть |
| Создать admin login | 100% | Done | `/admin/login` |
| Создать admin session cookie | 100% | Done | `lib/auth.js` |
| Создать logout flow | 100% | Done | Admin logout |
| Защитить admin pages | 100% | Done | `requireAdmin()` |
| Добавить admin password env | 100% | Done | `ADMIN_PASSWORD` |
| Создать customer registration | 0% | Not started | Нет user accounts |
| Создать customer login | 0% | Not started | Нет |
| Добавить password hashing | 0% | Not started | Для future customer auth |
| Защитить customer profile | 0% | Not started | Сейчас lookup по телефону |

## EPIC 07 - Public shop | Epic progress: 85% | Tasks: 9 / 11 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать `/shop` page | 100% | Done | Route работает |
| Создать `/product/[slug]` page | 100% | Done | SSG pages работают |
| Создать product card component | 100% | Done | `ProductCard` |
| Создать product grid | 100% | Done | Grid есть |
| Подключить products | 100% | Done | Products from SQLite database |
| Добавить category filter | 100% | Done | Query filter |
| Добавить search | 100% | Done | Query search |
| Добавить sorting by price | 100% | Done | ASC/DESC |
| Добавить sorting by newest/popular | 100% | Done | Query sort |
| Добавить stock filter | 0% | Not started | Нужно добавить availability filter |
| Добавить pagination/infinite load | 0% | Not started | Пока все товары сразу |

## EPIC 08 - Cart | Epic progress: 85% | Tasks: 7 / 8 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать cart provider | 100% | Done | `CartProvider` |
| Сохранять cart в localStorage | 100% | Done | `norapat-cart` |
| Добавить add to cart | 100% | Done | Button работает |
| Добавить remove from cart | 100% | Done | Cart page |
| Добавить quantity update | 100% | Done | +/- buttons |
| Создать `/cart` page | 100% | Done | Route работает |
| Показать subtotal/total | 100% | Done | Delivery + total |
| Добавить promo code apply | 0% | Not started | Нет promo logic |

## EPIC 09 - Checkout | Epic progress: 90% | Tasks: 9 / 10 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать `/checkout` page | 100% | Done | Route работает |
| Создать checkout form | 100% | Done | Name/phone/address/payment |
| Добавить required validation | 70% | Done | HTML required fields |
| Создать server order API | 100% | Done | `/api/orders` |
| Сохранять order в database | 100% | Done | SQLite `orders` |
| Сохранять order items | 100% | Done | SQLite `order_items` |
| Добавить cash payment | 100% | Done | Cash selected |
| Добавить order confirmation | 100% | Done | Shows order number |
| Проверять cart server-side | 80% | Done | API пересчитывает цены по database |
| Добавить promo code apply | 100% | Done | `WELCOME10`, `/api/promos` |
| Online payment provider | 0% | Not started | Не выбран |

## EPIC 10 - Customer profile | Epic progress: 45% | Tasks: 4 / 8 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать `/account` page | 100% | Done | Route есть |
| Показать order lookup по телефону | 100% | Done | `/account?phone=...` |
| Показать order history | 100% | Done | Orders from database |
| Создать `/account/orders` page | 0% | Not started | Используется same account page |
| Показать real profile data | 0% | Not started | Customer auth нет |
| Добавить profile edit | 0% | Not started | Нет |
| Добавить saved addresses | 0% | Not started | Нет |
| Добавить order detail | 0% | Not started | Нет отдельной страницы |
| Добавить wishlist | 0% | Not started | Нет |

## EPIC 11 - Admin panel | Epic progress: 85% | Tasks: 10 / 12 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать `/admin` route | 100% | Done | Route работает |
| Создать dashboard UI | 100% | Done | Stats/cards/orders/products |
| Показать products list | 100% | Done | Products from database |
| Показать database orders | 100% | Done | Orders from SQLite |
| Показать basic revenue stats | 100% | Done | Revenue/average check from DB |
| Создать orders API | 100% | Done | GET/POST `/api/orders` |
| Защитить admin route | 100% | Done | Admin login required |
| Product create/edit/delete | 100% | Done | Add/edit/hide product |
| Categories CRUD | 100% | Done | Add/delete categories |
| Order status update | 100% | Done | Status select |
| Promo code management | 100% | Done | Add/delete promo codes |
| Product image upload | 30% | Partial | Image URL works, file upload нет |
| Customer list | 0% | Not started | Нет registered customers |

## EPIC 12 - Analytics | Epic progress: 55% | Tasks: 5 / 9 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать analytics area в admin | 100% | Done | Stats cards |
| Считать total orders | 100% | Done | Database orders |
| Считать total revenue | 100% | Done | Database orders |
| Считать average order value | 100% | Done | Database orders |
| Orders by status | 50% | Partial | Status stored and editable |
| Today/week/month filters | 0% | Not started | Нет date filters |
| Top 5 products | 0% | Not started | Нет query |
| Least-selling products | 0% | Not started | Нет query |
| Customer analytics | 0% | Not started | Auth/database нет |

## EPIC 13 - Static/legal pages | Epic progress: 80% | Tasks: 7 / 9 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Создать About page | 100% | Done | `/about` |
| Создать Contact page | 100% | Done | `/contact` |
| Создать Privacy Policy | 100% | Done | Draft page |
| Создать Terms and Conditions | 100% | Done | Draft page |
| Создать Refund Policy | 100% | Done | Draft page |
| Создать Delivery Policy | 100% | Done | Draft page |
| Добавить footer links | 100% | Done | Footer links есть |
| Добавить real contact information | 20% | Partial | Placeholder phone/email |
| Проверить legal text | 0% | Not started | Нужен final business/legal approval |

## EPIC 14 - Testing and deployment | Epic progress: 45% | Tasks: 4 / 9 done

| Task | Progress | Status | Notes |
| --- | ---: | --- | --- |
| Проверить production build | 100% | Done | `npm.cmd run build` passed |
| Проверить generated routes | 100% | Done | 22 routes generated |
| Исправить import alias | 100% | Done | `jsconfig.json` added |
| Создать database init command | 100% | Done | `npm.cmd run db:init` |
| Добавить lint script | 0% | Not started | Нет |
| Добавить test setup | 0% | Not started | Нет |
| Проверить checkout flow вручную | 0% | Not started | Нужно browser QA |
| Проверить responsive UI вручную | 0% | Not started | Нужно browser QA |
| Настроить Vercel deploy | 0% | Not started | Нет |
| Настроить production database/env | 0% | Not started | Нет |

## Что работает сейчас

- Home page
- Shop page с search/filter/sorting
- Product detail pages
- Add to cart
- Cart with quantity update/remove/total
- Checkout with cash order flow
- Order confirmation
- Orders saved in server SQLite database
- Admin dashboard with database orders and basic analytics
- Customer account order lookup by phone
- About/contact/legal pages
- Production build passes

## Что нужно сделать дальше

1. Добавить real file upload для images.
2. Выбрать online payment provider.
3. Добавить customer registration/login, если нужен личный кабинет с паролем.
4. Позже перенести SQLite на Supabase/Neon PostgreSQL для production.
5. Провести browser QA и responsive QA.
