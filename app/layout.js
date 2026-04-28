import "./globals.css";

export const metadata = {
  title: "Norapat Shop",
  description: "Foodcourt e-commerce experience for Norapat.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
