import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Norapat Shop",
  description: "Foodcourt e-commerce experience for Norapat.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
