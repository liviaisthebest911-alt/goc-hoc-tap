import Link from "next/link";
import { PenLine } from "lucide-react";
import { TrebleClef } from "./Art";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand">
          <TrebleClef className="" />
          Minh Anh
        </Link>
        <nav className="nav">
          <Link href="/">Góc học tập</Link>
          <Link href="/#ve-toi">Về tôi</Link>
          <Link href="/write" className="btn">
            <PenLine size={18} strokeWidth={1.25} /> Viết bài mới
          </Link>
        </nav>
      </div>
    </header>
  );
}