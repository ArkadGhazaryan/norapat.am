export const categories = [
  { id: "pizza", name: "Пицца" },
  { id: "burger", name: "Бургеры" },
  { id: "grill", name: "Гриль" },
  { id: "salad", name: "Салаты" },
  { id: "drink", name: "Напитки" },
];

export const products = [
  {
    id: "margherita",
    slug: "margherita",
    name: "Пицца Маргарита",
    category: "pizza",
    price: 2900,
    oldPrice: 3400,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80",
    description:
      "Классическая пицца с томатным соусом, моцареллой, базиликом и тонким хрустящим тестом.",
    popular: true,
    stock: 18,
  },
  {
    id: "pepperoni",
    slug: "pepperoni",
    name: "Пицца Пепперони",
    category: "pizza",
    price: 3600,
    oldPrice: 0,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
    description:
      "Насыщенная пицца с пепперони, сыром и фирменным соусом Norapat.",
    popular: true,
    stock: 12,
  },
  {
    id: "classic-burger",
    slug: "classic-burger",
    name: "Классический бургер",
    category: "burger",
    price: 2400,
    oldPrice: 2900,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    description:
      "Сочная котлета, свежие овощи, сыр, соус и мягкая булочка с кунжутом.",
    popular: true,
    stock: 25,
  },
  {
    id: "bbq-burger",
    slug: "bbq-burger",
    name: "BBQ бургер",
    category: "burger",
    price: 2800,
    oldPrice: 0,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    description:
      "Бургер с BBQ соусом, карамелизированным луком, сыром и хрустящим салатом.",
    popular: false,
    stock: 15,
  },
  {
    id: "chicken-grill",
    slug: "chicken-grill",
    name: "Курица гриль",
    category: "grill",
    price: 3900,
    oldPrice: 4500,
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=80",
    description:
      "Маринованная курица гриль с ароматными специями и гарниром на выбор.",
    popular: true,
    stock: 9,
  },
  {
    id: "caesar",
    slug: "caesar",
    name: "Салат Цезарь",
    category: "salad",
    price: 2100,
    oldPrice: 0,
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80",
    description:
      "Свежий салат с курицей, пармезаном, сухариками и классическим соусом.",
    popular: false,
    stock: 20,
  },
  {
    id: "lemonade",
    slug: "lemonade",
    name: "Домашний лимонад",
    category: "drink",
    price: 900,
    oldPrice: 0,
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
    description:
      "Освежающий лимонад с лимоном, мятой и легкой сладостью.",
    popular: false,
    stock: 40,
  },
  {
    id: "berry-drink",
    slug: "berry-drink",
    name: "Ягодный напиток",
    category: "drink",
    price: 1100,
    oldPrice: 1300,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
    description:
      "Холодный ягодный напиток с насыщенным вкусом и натуральным сиропом.",
    popular: true,
    stock: 32,
  },
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getCategoryName(id) {
  return categories.find((category) => category.id === id)?.name ?? "Другое";
}
