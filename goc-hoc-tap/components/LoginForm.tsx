"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      setError(data?.error || "Có lỗi xảy ra");
    } catch {
      setError("Không kết nối được máy chủ");
    }
    setBusy(false);
  }

  return (
    <form className="form narrow" onSubmit={submit}>
      <label>
        Mật khẩu Admin
        <input
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Đang kiểm tra…" : "Đăng nhập"}</button>
    </form>
  );
}
