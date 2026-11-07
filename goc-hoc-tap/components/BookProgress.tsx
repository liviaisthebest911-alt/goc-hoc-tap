"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";

/*
 * Tiến độ đọc truyện của từng người xem, lưu trên trình duyệt của họ.
 * localStorage có thể bị chặn, khi đó tiến độ chỉ đơn giản là không được nhớ.
 */
const keyOf = (bookId: string) => `ojm:read:${bookId}`;
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    removeEventListener("storage", fn);
  };
}

function read(bookId: string) {
  try {
    return localStorage.getItem(keyOf(bookId)) ?? "[]";
  } catch {
    return "[]";
  }
}

function write(bookId: string, ids: string[] | null) {
  try {
    if (ids) localStorage.setItem(keyOf(bookId), JSON.stringify(ids));
    else localStorage.removeItem(keyOf(bookId));
  } catch {}
  listeners.forEach((fn) => fn());
}

function parse(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function MarkChapterRead({ bookId, chapterId }: { bookId: string; chapterId: string }) {
  useEffect(() => {
    const ids = parse(read(bookId));
    if (!ids.includes(chapterId)) write(bookId, [...ids, chapterId]);
  }, [bookId, chapterId]);
  return null;
}

export default function BookProgress({ bookId, chapterIds }: { bookId: string; chapterIds: string[] }) {
  const raw = useSyncExternalStore(subscribe, () => read(bookId), () => "[]");
  const seen = new Set(parse(raw));
  const done = chapterIds.filter((id) => seen.has(id)).length;
  if (chapterIds.length === 0) return null;

  const next = chapterIds.find((id) => !seen.has(id));

  return (
    <div className="book-progress">
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={chapterIds.length} aria-valuenow={done} aria-label="Tiến độ đọc">
        <span style={{ width: `${(done / chapterIds.length) * 100}%` }} />
      </div>
      <p>
        {done === 0 ? `${chapterIds.length} chương` : `Bạn đã đọc ${done}/${chapterIds.length} chương`}
      </p>
      <div className="form-actions">
        <Link href={`/books/${bookId}/${next ?? chapterIds[0]}`} className="btn">
          {done === 0 ? "Đọc từ đầu" : next ? "Đọc tiếp" : "Đọc lại"}
        </Link>
        {done > 0 && (
          <button type="button" className="link" onClick={() => write(bookId, null)}>Xóa tiến độ</button>
        )}
      </div>
    </div>
  );
}
