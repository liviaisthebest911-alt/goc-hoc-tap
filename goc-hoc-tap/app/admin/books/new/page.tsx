import type { Metadata } from "next";
import BookForm from "@/components/BookForm";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Thêm truyện", robots: { index: false } };

export default async function NewBookPage() {
  await requireAdmin();
  return (
    <div className="page">
      <h1>Thêm truyện</h1>
      <BookForm />
    </div>
  );
}
