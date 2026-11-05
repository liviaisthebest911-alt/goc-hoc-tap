import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import BookForm from "@/components/BookForm";
import ChapterManager from "@/components/ChapterManager";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import { requireAdmin } from "@/lib/auth";
import { getBookAdmin, listChaptersAdmin } from "@/lib/books-admin";

export const metadata: Metadata = { title: "Sửa truyện", robots: { index: false } };

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await params;
  const book = await getBookAdmin(id);
  if (!book) notFound();
  const chapters = await listChaptersAdmin(book.id);

  return (
    <div className="page">
      <Link href="/admin/books" className="back">
        <ChevronLeft size={16} strokeWidth={1.5} /> Danh sách truyện
      </Link>
      <h1>Sửa truyện</h1>
      <BookForm book={book} />
      <ChapterManager
        bookId={book.id}
        chapters={chapters.map(({ id, title }) => ({ id, title }))}
      />
      <p className="form-actions">
        <ConfirmDeleteButton
          url={`/api/books/${book.id}`}
          confirmText={`Xóa vĩnh viễn truyện "${book.title}" và ${chapters.length} chương của truyện?`}
          redirectTo="/admin/books"
          label="Xóa truyện này"
        />
      </p>
    </div>
  );
}
