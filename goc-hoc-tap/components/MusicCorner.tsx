"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { SCALE, playNote } from "@/lib/synth";
import { Violin } from "./Art";
import { usePlaying } from "./NowPlaying";

const MAX_PLAYED = 14;

export default function MusicCorner() {
  const playing = usePlaying();
  const [played, setPlayed] = useState<number[]>([]);
  const corner = useRef<HTMLDivElement>(null);
  const handled = useRef(false);

  function press(degree: number) {
    playNote(degree);
    setPlayed((list) => [...list, degree].slice(-MAX_PLAYED));
  }

  useEffect(() => {
    const box = corner.current;
    if (!box) return;
    let visible = false;
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    seen.observe(box);
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      const degree = SCALE.findIndex((note) => note.key === e.key.toLowerCase());
      if (degree >= 0) press(degree);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      seen.disconnect();
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={corner} className="corner">
      <Violin className="violin corner-violin" />
      <p className="corner-lead">
        Bấm phím bằng chuột, tay hoặc phím <kbd>A</kbd> đến <kbd>K</kbd>. Mỗi nốt được đàn ngay trên
        trình duyệt của bạn.
      </p>

      <div className="piano" role="group" aria-label="Đàn piano một quãng tám">
        {SCALE.map((note, degree) => (
          <button
            key={note.name}
            type="button"
            aria-label={`Nốt ${note.name}`}
            aria-keyshortcuts={note.key}
            data-on={playing?.label === `Nốt ${note.name}`}
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse") return;
              handled.current = true;
              press(degree);
            }}
            onClick={(e) => {
              // Cảm ứng chỉ mở khóa âm thanh ở click, không phải pointerdown.
              if (e.detail === 0 || !handled.current) press(degree);
              handled.current = false;
            }}
          >
            <span aria-hidden="true">{note.key.toUpperCase()}</span>
          </button>
        ))}
      </div>

      <div className="played">
        {played.length > 0 ? (
          <p className="played-bits">{played.map((d) => d % 2).join("")}</p>
        ) : (
          <p className="played-hint">Giai điệu của bạn sẽ hiện ở đây dưới dạng bit.</p>
        )}
        {played.length > 0 && (
          <button type="button" className="link" onClick={() => setPlayed([])}>
            <Eraser size={15} strokeWidth={1.5} aria-hidden="true" /> Xóa
          </button>
        )}
      </div>
    </div>
  );
}
