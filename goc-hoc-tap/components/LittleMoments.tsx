"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Moment } from "@/lib/site";
import { usePlaying } from "./NowPlaying";

const STEP = 10; // px giữa hai cao độ, bằng nửa khoảng cách dòng kẻ khuông

/* Mỗi bài viết hoặc truyện là một nốt thật trên khuông, xếp theo thứ tự thời gian. */
export default function LittleMoments({ moments }: { moments: Moment[] }) {
  const playing = usePlaying();
  const box = useRef<HTMLDivElement>(null);

  // Cuộn ngang trong khung, không kéo cả trang: người xem có thể đang bấm nghe ở hero.
  useEffect(() => {
    const el = box.current;
    const note = el?.querySelector<HTMLElement>('[data-active="true"]');
    if (el && note) el.scrollTo({ left: note.offsetLeft - (el.clientWidth - note.offsetWidth) / 2 });
  }, [playing?.id]);

  if (moments.length === 0) return <p className="empty">Khuông nhạc đang chờ nốt đầu tiên.</p>;

  return (
    <div ref={box} className="score-scroll" tabIndex={0} role="region" aria-label="Dòng thời gian Little Moments">
      <ol className="score" style={{ "--n": moments.length } as React.CSSProperties}>
        {moments.map((m) => {
          const inner = (
            <>
              <span
                className={`note${m.filled ? " filled" : ""}`}
                style={{ "--lift": `${m.degree * STEP}px` } as React.CSSProperties}
                aria-hidden="true"
              />
              <time dateTime={m.iso}>{m.dateLabel}</time>
              <strong>{m.title}</strong>
              <small>{m.kindLabel}</small>
            </>
          );
          return (
            <li key={m.id} data-active={playing?.id === m.id}>
              {m.href ? <Link href={m.href}>{inner}</Link> : <div>{inner}</div>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
