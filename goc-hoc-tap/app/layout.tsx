import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import Header from "../components/Header";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  variable: "--font-serif",
});
const sans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Góc học tập của Minh Anh",
  description: "Portfolio và blog chia sẻ những gì mình đang học.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header />
        <main className="wrap">{children}</main>
        <footer className="site-footer">Góc học tập của Minh Anh, viết chậm, học kỹ.</footer>
      </body>
    </html>
  );
}