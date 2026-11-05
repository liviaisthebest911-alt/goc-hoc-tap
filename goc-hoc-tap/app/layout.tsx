import type { Metadata } from "next";
import { Patrick_Hand, Fraunces, JetBrains_Mono, Newsreader } from "next/font/google";
import Link from "next/link";
import CursorFX from "../components/CursorFX";
import Header from "../components/Header";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin", "vietnamese"],
  axes: ["opsz", "SOFT"],
  variable: "--font-display",
});
const body = Newsreader({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-body",
});
const hand = Patrick_Hand({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-hand",
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
      className={`${display.variable} ${body.variable} ${hand.variable} ${mono.variable}`}
    >
      <body>
        <CursorFX />
        <Header />
        <main className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <span>Góc học tập của OJM, viết chậm, học kỹ.</span>
            <Link href="/admin">Quản trị</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
