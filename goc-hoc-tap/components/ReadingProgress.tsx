"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useHydrated } from "@/lib/use-draft";

/**
 * Thanh đọc bài. Tính theo thẻ article nên phần footer không làm sai tỷ lệ.
 * Gắn thẳng vào body vì main có stacking context riêng, nằm trong đó sẽ bị header che.
 */
export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const article = document.querySelector("article");
      if (!article || !bar.current) return;
      const { top, height } = article.getBoundingClientRect();
      const span = height - innerHeight;
      const ratio = span > 0 ? Math.min(1, Math.max(0, -top / span)) : 1;
      bar.current.style.transform = `scaleX(${ratio})`;
    };
    const queue = () => { frame ||= requestAnimationFrame(measure); };
    measure();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
    };
  }, [hydrated]);

  if (!hydrated) return null;
  return createPortal(<div ref={bar} className="read-bar" aria-hidden="true" />, document.body);
}
