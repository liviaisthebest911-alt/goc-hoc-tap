"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  url: string;
  confirmText: string;
  /** Chuyển trang sau khi xóa. Bỏ trống thì chỉ làm mới trang hiện tại. */
  redirectTo?: string;
  label?: string;
};

/** Nút xóa có hỏi lại, dùng cho truyện và chương. */
export default function ConfirmDeleteButton({ url, confirmText, redirectTo, label = "Xóa" }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm(confirmText)) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok || res.status === 404) {
        if (redirectTo) router.push(redirectTo);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      setError(data?.error || "Không xóa được");
    } catch {
      setError("Không kết nối được máy chủ");
    }
    setBusy(false);
  }

  return (
    <>
      <button type="button" className="link danger" onClick={remove} disabled={busy}>
        {busy ? "Đang xóa…" : label}
      </button>
      {error && <span className="error" role="alert">{error}</span>}
    </>
  );
}
