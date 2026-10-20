"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Send } from "lucide-react";

export default function WritePage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function publish() {
    setError("");
    setBusy(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode, title, tag, body }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Có lỗi xảy ra");
    }
  }

  return (
    <div className="editor">
      <h1 style={{ fontSize: 40 }}>Viết bài mới</h1>
      <input type="password" placeholder="Mật khẩu Admin" value={passcode}
        onChange={(e) => setPasscode(e.target.value)} />
      <input placeholder="Tiêu đề bài viết" value={title}
        onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Chủ đề (ví dụ: Toán học)" value={tag}
        onChange={(e) => setTag(e.target.value)} />

      {preview ? (
        <div className="box md">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || "Chưa có nội dung để xem."}</ReactMarkdown>
        </div>
      ) : (
        <textarea placeholder="Viết bằng Markdown: ## tiêu đề, **đậm**, - danh sách, ```code```"
          value={body} onChange={(e) => setBody(e.target.value)} />
      )}

      {error && <p className="error">{error}</p>}

      <div className="row">
        <button className="btn ghost" onClick={() => setPreview(!preview)}>
          <Eye size={18} strokeWidth={1.25} /> {preview ? "Quay lại soạn" : "Xem trước"}
        </button>
        <button className="btn" onClick={publish} disabled={busy}>
          <Send size={18} strokeWidth={1.25} /> {busy ? "Đang đăng…" : "Đăng bài"}
        </button>
      </div>
    </div>
  );
}