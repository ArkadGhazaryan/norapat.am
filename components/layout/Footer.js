import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Norapat.am</strong>
        <p>Foodcourt e-commerce experience with delivery, checkout and admin tools.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/about">О нас</Link>
        <Link href="/contact">Контакты</Link>
        <Link href="/delivery-policy">Доставка</Link>
        <Link href="/refund-policy">Возврат</Link>
        <Link href="/privacy-policy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </footer>
  );
}
