import Link from "next/link";
import { TrebleClef } from "./Art";
import SiteNav from "./SiteNav";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand">
          <TrebleClef className="" />
          OJM
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
