"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { Book } from "@/lib/book-input";

export default function BookForm({ book }: { book?: Book }) {
  const router = useRouter();
  const [title, setTitle] = useState(book?.title ?? "");
  const [published, setPublished] = useState(book?.published ?? false);
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setSessionExpired(false);
    setBusy(true);
    try {
      const res = await fetch(book ? `/api/books/${encodeURIComponent(book.id)}` : "/api/books", {
        method: book ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, published }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        if (book) {
          setSaved(true);
          router.refresh();
        } else {
          router.push(`/admin/books/${data.id}`);
          router.refresh();
          return;
        }
      } else {
        setSessionExpired(res.status === 401);
        setError(data?.error || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không kết nối được máy chủ");
    }
    setBusy(false);
  }

  return (
    <form className="form" onSubmit={save}>
      <label>
        Tên truyện
        <input required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="check">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Xuất bản (người đọc sẽ thấy truyện và toàn bộ chương)
      </label>

      {error && (
        <p className="error" role="alert">
          {error}
          {sessionExpired && (
            <>
              {" "}
              <Link href="/admin/login" target="_blank">Đăng nhập lại ở tab mới</Link>
              {" "}rồi bấm lưu.
            </>
          )}
        </p>
      )}
      {saved && <p className="muted" role="status">Đã lưu.</p>}

      <div className="form-actions">
        <button className="btn" disabled={busy}>
          <Save size={16} strokeWidth={1.5} />
          {busy ? "Đang lưu…" : book ? "Lưu thay đổi" : "Tạo truyện"}
        </button>
        {!book && <Link href="/admin/books" className="muted">Hủy</Link>}
      </div>
    </form>
  );
}
