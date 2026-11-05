import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import { requireAdmin } from "@/lib/auth";
import { listAllBooks } from "@/lib/books-admin";
import { fmtDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Quản trị Liu's Book", robots: { index: false } };

export default async function AdminBooksPage() {
  await requireAdmin();
  const books = await listAllBooks();

  return (
    <div className="page">
      <Link href="/admin" className="back">
        <ChevronLeft size={16} strokeWidth={1.5} /> Quản trị
      </Link>
      <div className="page-head">
        <h1>Quản trị Liu&apos;s Book</h1>
        <Link href="/admin/books/new" className="btn">
          <Plus size={16} strokeWidth={1.5} /> Thêm truyện
        </Link>
      </div>

      {books.length === 0 ? (
        <p className="empty">Chưa có truyện nào.</p>
      ) : (
        <ul className="admin-list">
          {books.map((book) => (
            <li key={book.id}>
              <div>
                <Link href={`/admin/books/${book.id}`} className="admin-title">{book.title}</Link>
                <p className="muted">
                  {book.published ? "Đã xuất bản" : "Bản nháp"} · {book.chapter_count} chương ·{" "}
                  {fmtDate(book.created_at)}
                </p>
              </div>
              <div className="admin-actions">
                <Link href={`/admin/books/${book.id}`}>Sửa</Link>
                <ConfirmDeleteButton
                  url={`/api/books/${book.id}`}
                  confirmText={`Xóa vĩnh viễn truyện "${book.title}" và ${book.chapter_count} chương của truyện?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
