import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Norapat.am</strong>
        <p>Онлайн-заказ готовой еды с доставкой, корзиной, оплатой и управлением заказами.</p>
      </div>
      <nav aria-label="Навигация в подвале">
        <Link href="/about">О нас</Link>
        <Link href="/contact">Контакты</Link>
        <Link href="/delivery-policy">Доставка</Link>
        <Link href="/refund-policy">Возврат</Link>
        <Link href="/privacy-policy">Конфиденциальность</Link>
        <Link href="/terms">Условия</Link>
      </nav>
    </footer>
  );
}
