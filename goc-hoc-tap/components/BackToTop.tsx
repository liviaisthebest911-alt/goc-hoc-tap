"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(scrollY > 640);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <button type="button" className="to-top" aria-label="Về đầu trang" onClick={() => scrollTo({ top: 0 })}>
      <ArrowUp size={20} strokeWidth={1.5} />
    </button>
  );
}
