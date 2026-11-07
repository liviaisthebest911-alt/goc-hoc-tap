"use client";

import { useMemo, useState, type ClipboardEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, PenLine, Send } from "lucide-react";
import DraftNotice from "@/components/DraftNotice";
import Markdown from "@/components/Markdown";
import { isPostDraft, postDraftKey, type PostDraft } from "@/lib/drafts";
import { MAX_IMAGE_BYTES } from "@/lib/post-input";
import { useAutosave, useHydrated, useRestoredDraft } from "@/lib/use-draft";
import { fmtDate, readMinutes } from "@/lib/utils";
import type { Post } from "@/lib/posts";

type Props = {
  post?: Post;
  initialDate: string;
  topics: string[];
};

/* Ảnh đang tải dở lúc nháp được lưu sẽ không bao giờ hoàn tất, nên bỏ chỗ giữ của nó. */
const UNFINISHED_UPLOAD = /!\[Đang tải ảnh [^\]]*\]\(\)/g;

export default function PostEditor(props: Props) {
  return useHydrated() ? <Editor {...props} /> : <p className="muted">Đang mở trình soạn thảo…</p>;
}

function Editor({ post, initialDate, topics }: Props) {
  const router = useRouter();
  const key = postDraftKey(post?.id);
  // date là null khi chưa đổi, để nháp bài mới mở lại hôm sau vẫn lấy ngày đăng mới.
  const server = useMemo<PostDraft>(
    () => ({ title: post?.title ?? "", tag: post?.tag ?? "", date: null, body: post?.body ?? "" }),
    [post],
  );
  const [restored, setRestored] = useRestoredDraft(key, server, isPostDraft);
  const [title, setTitle] = useState(restored?.data.title ?? server.title);
  const [tag, setTag] = useState(restored?.data.tag ?? server.tag);
  const [date, setDate] = useState(restored?.data.date ?? initialDate);
  const [body, setBody] = useState(() => (restored?.data.body ?? server.body).replace(UNFINISHED_UPLOAD, ""));
  const draft = useAutosave(key, server, { title, tag, date: date === initialDate ? null : date, body });
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);

  // Ctrl+V ảnh: chèn placeholder tại con trỏ, upload xong thì thay bằng URL thật.
  async function onPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.clipboardData.files).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    event.preventDefault();
    setError("");
    if (files.some((file) => file.size > MAX_IMAGE_BYTES)) {
      setError("Ảnh quá lớn (tối đa 4MB)");
      return;
    }

    const el = event.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const stamp = Date.now();
    const marks = files.map((_, i) => `![Đang tải ảnh ${stamp}-${i}…]()`);
    const insert = marks.join("\n\n");
    setBody((cur) => cur.slice(0, start) + insert + cur.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + insert.length, start + insert.length);
    });

    setUploading((n) => n + files.length);
    await Promise.all(
      files.map(async (file, i) => {
        let md = "";
        try {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/uploads", { method: "POST", body: form });
          const data = await res.json().catch(() => null);
          if (res.ok) md = `![](${data.url})`;
          else {
            setSessionExpired(res.status === 401);
            setError(data?.error || "Không tải được ảnh lên");
          }
        } catch {
          setError("Không kết nối được máy chủ");
        }
        setBody((cur) => cur.replace(marks[i], md));
        setUploading((n) => n - 1);
      }),
    );
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSessionExpired(false);
    setBusy(true);
    try {
      const res = await fetch(post ? `/api/posts/${encodeURIComponent(post.id)}` : "/api/posts", {
        method: post ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tag,
          body,
          // Giữ nguyên giờ đăng gốc nếu Admin không đổi ngày.
          ...(date === initialDate ? {} : { date }),
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        draft.finish();
        router.push(post ? `/posts/${data.id}` : "/");
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
    setTag(server.tag);
    setDate(initialDate);
    setBody(server.body);
  }

  return (
    <form className="form" onSubmit={save}>
      <DraftNotice
        restored={restored}
        saved={draft.saved}
        dirty={draft.dirty}
        otherTab={draft.otherTab}
        existing={!!post}
        onDiscard={discardDraft}
      />
      {/* Khóa ô nhập khi đang lưu: chữ gõ thêm lúc này sẽ không nằm trong bản được gửi đi. */}
      <fieldset className="form-fields" disabled={busy}>
      <label>
        Tiêu đề
        <input required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <div className="form-row">
        <label>
          Chủ đề
          <input
            list="topic-options"
            maxLength={50}
            placeholder="Ví dụ: Toán học"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <datalist id="topic-options">
            {topics.map((topic) => <option key={topic} value={topic} />)}
          </datalist>
        </label>
        <label>
          Ngày đăng
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      {preview ? (
        <div className="preview" role="region" aria-label="Xem trước">
          <div className="meta">
            {tag.trim() && <span className="tag">{tag.trim()}</span>}
            {date && <span>{fmtDate(`${date}T12:00:00+07:00`)}</span>}
            <span>{readMinutes(body)} phút đọc</span>
          </div>
          <h1>{title || "Chưa có tiêu đề"}</h1>
          <Markdown>{body || "Chưa có nội dung để xem."}</Markdown>
        </div>
      ) : (
        <label>
          Nội dung (Markdown)
          <textarea
            required
            placeholder="## Tiêu đề, **đậm**, - danh sách, ```code```"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onPaste={onPaste}
          />
          <span className="muted">
            {uploading > 0 ? "Đang tải ảnh lên…" : "Dán ảnh (Ctrl+V) vào bất kỳ vị trí nào để chèn."}
          </span>
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
        <button className="btn" disabled={busy || uploading > 0}>
          <Send size={16} strokeWidth={1.5} />
          {busy ? "Đang lưu…" : post ? "Lưu thay đổi" : "Đăng bài"}
        </button>
        <Link href="/admin" className="muted">Hủy</Link>
      </div>
    </form>
  );
}
