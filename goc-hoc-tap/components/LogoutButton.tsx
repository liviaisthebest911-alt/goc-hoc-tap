"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => null);
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button className="btn ghost" onClick={logout} disabled={busy}>
      <LogOut size={16} strokeWidth={1.5} /> Đăng xuất
    </button>
  );
}
