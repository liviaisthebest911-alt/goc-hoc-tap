import type { Metadata } from "next";
import { EB_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Header from "../components/Header";
import "./globals.css";

const serif = EB_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  variable: "--font-serif",
});
const sans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: { default: "Góc học tập của OJM", template: "%s · OJM" },
  description: "Portfolio và blog chia sẻ những gì mình đang học.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <body>
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