import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChapterEditor from "@/components/ChapterEditor";
import { requireAdmin } from "@/lib/auth";
import { getBookAdmin, getChapterAdmin } from "@/lib/books-admin";

export const metadata: Metadata = { title: "Sửa chương", robots: { index: false } };

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  await requireAdmin();

  const { id, chapterId } = await params;
  const [book, chapter] = await Promise.all([getBookAdmin(id), getChapterAdmin(id, chapterId)]);
  if (!book || !chapter) notFound();

  return (
    <div className="page">
      <p className="muted">{book.title}</p>
      <h1>Sửa chương</h1>
      <ChapterEditor bookId={book.id} chapter={chapter} />
    </div>
  );
}
