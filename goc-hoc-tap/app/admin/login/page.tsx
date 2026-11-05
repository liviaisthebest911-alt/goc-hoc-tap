import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Đăng nhập", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="page narrow">
      <h1>Đăng nhập</h1>
      <LoginForm />
    </div>
  );
}
