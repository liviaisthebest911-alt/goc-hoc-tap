"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, PenLine, Save } from "lucide-react";
import DraftNotice from "@/components/DraftNotice";
import Markdown from "@/components/Markdown";
import type { Chapter } from "@/lib/book-input";
import { chapterDraftKey, isChapterDraft, type ChapterDraft } from "@/lib/drafts";
import { useAutosave, useHydrated, useRestoredDraft } from "@/lib/use-draft";

type Props = { bookId: string; chapter?: Chapter };

export default function ChapterEditor(props: Props) {
  return useHydrated() ? <Editor {...props} /> : <p className="muted">Đang mở trình soạn thảo…</p>;
}

function Editor({ bookId, chapter }: Props) {
  const router = useRouter();
  const key = chapterDraftKey(bookId, chapter?.id);
  const server = useMemo<ChapterDraft>(
    () => ({ title: chapter?.title ?? "", content: chapter?.content ?? "" }),
    [chapter],
  );
  const [restored, setRestored] = useRestoredDraft(key, server, isChapterDraft);
  const [title, setTitle] = useState(restored?.data.title ?? server.title);
  const [content, setContent] = useState(restored?.data.content ?? server.content);
  const draft = useAutosave(key, server, { title, content });
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
        draft.finish();
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

  function discardDraft() {
    draft.discard();
    setRestored(null);
    setTitle(server.title);
    setContent(server.content);
  }

  return (
    <form className="form" onSubmit={save}>
      <DraftNotice
        restored={restored}
        saved={draft.saved}
        dirty={draft.dirty}
        otherTab={draft.otherTab}
        existing={!!chapter}
        onDiscard={discardDraft}
      />
      {/* Khóa ô nhập khi đang lưu: chữ gõ thêm lúc này sẽ không nằm trong bản được gửi đi. */}
      <fieldset className="form-fields" disabled={busy}>
      <label>
        Tiêu đề chương
        <input required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      {preview ? (
        <div className="preview" role="region" aria-label="Xem trước">
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

      </fieldset>

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
