import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChapterEditor from "@/components/ChapterEditor";
import { requireAdmin } from "@/lib/auth";
import { getBookAdmin } from "@/lib/books-admin";

export const metadata: Metadata = { title: "Thêm chương", robots: { index: false } };

export default async function NewChapterPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await params;
  const book = await getBookAdmin(id);
  if (!book) notFound();

  return (
    <div className="page">
      <p className="muted">{book.title}</p>
      <h1>Thêm chương</h1>
      <ChapterEditor bookId={book.id} />
    </div>
  );
}
