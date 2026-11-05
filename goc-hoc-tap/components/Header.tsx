import Link from "next/link";
import { TrebleClef } from "./Art";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand">
          <TrebleClef className="" />
          OJM
        </Link>
        <nav className="nav">
          <Link href="/#bai-viet">Góc học tập</Link>
          <Link href="/books">Liu&apos;s Book</Link>
          <Link href="/#ve-toi">Về tôi</Link>
        </nav>
      </div>
    </header>
  );
}
