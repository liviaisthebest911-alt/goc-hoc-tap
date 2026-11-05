import type { Metadata } from "next";
import Link from "next/link";
import { listBooks } from "@/lib/books";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Liu's Book",
  description: "Những câu chuyện do Liu sáng tác.",
};

export default async function BooksPage() {
  const books = await listBooks();

  return (
    <div className="lib">
      <header className="lib-head">
        <p className="lib-kicker">Liu&apos;s Book</p>
        <h1>Truyện do mình viết</h1>
        <p className="lib-lead">Những câu chuyện nhỏ, viết chậm và đăng dần theo từng chương.</p>
      </header>

      {books.length === 0 ? (
        <p className="lib-empty">Chưa có truyện nào được đăng.</p>
      ) : (
        <ul className="lib-books">
          {books.map((book, index) => (
            <li key={book.id}>
              <Link href={`/books/${book.id}`}>
                <span className="lib-no" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="lib-title">{book.title}</span>
                <span className="lib-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
