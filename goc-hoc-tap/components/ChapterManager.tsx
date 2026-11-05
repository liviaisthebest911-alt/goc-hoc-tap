"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import type { Chapter } from "@/lib/book-input";

type Props = { bookId: string; chapters: Pick<Chapter, "id" | "title">[] };

export default function ChapterManager({ bookId, chapters }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const base = `/api/books/${encodeURIComponent(bookId)}/chapters`;

  async function move(index: number, delta: -1 | 1) {
    const next = chapters.map((c) => c.id);
    [next[index], next[index + delta]] = [next[index + delta], next[index]];

    setError("");
    setBusy(true);
    try {
      const res = await fetch(`${base}/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Không đổi được thứ tự chương");
      }
    } catch {
      setError("Không kết nối được máy chủ");
    }
    // Luôn tải lại từ máy chủ để hiển thị thứ tự thật, kể cả khi đổi thất bại.
    startTransition(() => router.refresh());
    setBusy(false);
  }

  const disabled = busy || pending;

  return (
    <section className="chapters">
      <div className="page-head">
        <h2>Chương ({chapters.length})</h2>
        <Link href={`/admin/books/${bookId}/chapters/new`} className="btn">
          <Plus size={16} strokeWidth={1.5} /> Thêm chương
        </Link>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      {chapters.length === 0 ? (
        <p className="empty">Truyện chưa có chương nào.</p>
      ) : (
        <ol className="admin-list chapter-list">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <div>
                <Link href={`/admin/books/${bookId}/chapters/${chapter.id}`} className="admin-title">
                  {index + 1}. {chapter.title}
                </Link>
              </div>
              <div className="admin-actions">
                <button
                  type="button"
                  className="link"
                  aria-label={`Đưa "${chapter.title}" lên`}
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp size={16} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className="link"
                  aria-label={`Đưa "${chapter.title}" xuống`}
                  disabled={disabled || index === chapters.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown size={16} strokeWidth={1.5} />
                </button>
                <Link href={`/admin/books/${bookId}/chapters/${chapter.id}`}>Sửa</Link>
                <ConfirmDeleteButton
                  url={`${base}/${encodeURIComponent(chapter.id)}`}
                  confirmText={`Xóa vĩnh viễn chương "${chapter.title}"?`}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
