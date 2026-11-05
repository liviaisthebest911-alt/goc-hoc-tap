"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm(`Xóa vĩnh viễn bài "${title}"?`)) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok || res.status === 404) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Không xóa được bài viết");
      }
    } catch {
      setError("Không kết nối được máy chủ");
    }
    setBusy(false);
  }

  return (
    <>
      <button className="link danger" onClick={remove} disabled={busy}>
        {busy ? "Đang xóa…" : "Xóa"}
      </button>
      {error && <span className="error" role="alert">{error}</span>}
    </>
  );
}
