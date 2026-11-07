"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { browserStore, clearAllDrafts } from "@/lib/drafts";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    setError("");
    setBusy(true);
    const res = await fetch("/api/admin/session", { method: "DELETE" }).catch(() => null);
    // Chưa đăng xuất được thì phiên vẫn còn, nên nháp cũng phải còn.
    if (!res?.ok) {
      setError("Chưa đăng xuất được, hãy thử lại");
      setBusy(false);
      return;
    }
    clearAllDrafts(browserStore());
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <button className="btn ghost" onClick={logout} disabled={busy}>
        <LogOut size={16} strokeWidth={1.5} /> Đăng xuất
      </button>
      {error && <span className="error" role="alert">{error}</span>}
    </>
  );
}
