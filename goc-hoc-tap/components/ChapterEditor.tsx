"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, PenLine, Save } from "lucide-react";
import Markdown from "@/components/Markdown";
import type { Chapter } from "@/lib/book-input";

type Props = { bookId: string; chapter?: Chapter };

export default function ChapterEditor({ bookId, chapter }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(chapter?.title ?? "");
  const [content, setContent] = useState(chapter?.content ?? "");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [busy, setBusy] = useState(false);

  const back = `/admin/books/${bookId}`;

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSessionExpired(false);
    setBusy(true);
    try {
      const base = `/api/books/${encodeURIComponent(bookId)}/chapters`;
      const res = await fetch(chapter ? `${base}/${encodeURIComponent(chapter.id)}` : base, {
        method: chapter ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        router.push(back);
        router.refresh();
        return;
      }
      setSessionExpired(res.status === 401);
      setError(data?.error || "Có lỗi xảy ra");
    } catch {
      setError("Không kết nối được máy chủ");
    }
    setBusy(false);
  }

  return (
    <form className="form" onSubmit={save}>
      <label>
        Tiêu đề chương
        <input required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      {preview ? (
        <div className="preview">
          <p className="eyebrow">Xem trước</p>
          <h1>{title || "Chưa có tiêu đề"}</h1>
          <Markdown>{content || "Chưa có nội dung để xem."}</Markdown>
        </div>
      ) : (
        <label>
          Nội dung (Markdown)
          <textarea
            placeholder="Viết nội dung chương. Có thể dùng Markdown."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
          {sessionExpired && (
            <>
              {" "}
              <Link href="/admin/login" target="_blank">Đăng nhập lại ở tab mới</Link>
              {" "}rồi bấm lưu, nội dung đang soạn vẫn được giữ.
            </>
          )}
        </p>
      )}

      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={() => setPreview(!preview)}>
          {preview ? <PenLine size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
          {preview ? "Quay lại soạn" : "Xem trước"}
        </button>
        <button className="btn" disabled={busy}>
          <Save size={16} strokeWidth={1.5} />
          {busy ? "Đang lưu…" : chapter ? "Lưu thay đổi" : "Thêm chương"}
        </button>
        <Link href={back} className="muted">Hủy</Link>
      </div>
    </form>
  );
}
