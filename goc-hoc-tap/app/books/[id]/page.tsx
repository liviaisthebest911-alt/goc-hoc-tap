import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getBook, listChapters } from "@/lib/books";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBook((await params).id);
  return book ? { title: book.title } : {};
}

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();
  const chapters = await listChapters(book.id);

  return (
    <div className="lib">
      <Link href="/books" className="lib-back">
        <ChevronLeft size={16} strokeWidth={1.5} /> Liu&apos;s Book
      </Link>

      <header className="lib-head">
        <h1>{book.title}</h1>
        <p className="lib-lead">{chapters.length} chương</p>
        {chapters.length > 0 && (
          <Link href={`/books/${book.id}/${chapters[0].id}`} className="lib-btn">
            Đọc từ đầu
          </Link>
        )}
      </header>

      {chapters.length === 0 ? (
        <p className="lib-empty">Truyện chưa có chương nào.</p>
      ) : (
        <ol className="lib-chapters">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <Link href={`/books/${book.id}/${chapter.id}`}>
                <span className="lib-no" aria-hidden="true">{index + 1}</span>
                <span className="lib-title">{chapter.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
