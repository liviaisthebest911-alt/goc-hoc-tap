import type { Metadata } from "next";
import { JetBrains_Mono, Literata, Noto_Serif_Display } from "next/font/google";
import Link from "next/link";
import BackToTop from "../components/BackToTop";
import CursorFX from "../components/CursorFX";
import Header from "../components/Header";
import "./globals.css";

const display = Noto_Serif_Display({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Literata({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: { default: "Góc học tập của OJM", template: "%s · OJM" },
  description: "Portfolio và blog chia sẻ những gì mình đang học.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <CursorFX />
        <Header />
        <main className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <p className="footer-line">Viết chậm, học kỹ.</p>
            <nav aria-label="Chân trang">
              <Link href="/#bai-viet">Góc học tập</Link>
              <Link href="/books">Liu&apos;s Book</Link>
              <Link href="/shelf">Kệ sách</Link>
              <Link href="/admin">Quản trị</Link>
            </nav>
          </div>
        </footer>
        <BackToTop />
      </body>
    </html>
  );
}
