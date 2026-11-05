import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Markdown from "@/components/Markdown";
import { getBook, listChapters } from "@/lib/books";
import { excerpt } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ id: string; chapterId: string }> };

async function load({ params }: Props) {
  const { id, chapterId } = await params;
  const book = await getBook(id);
  if (!book) return null;
  const chapters = await listChapters(book.id);
  const index = chapters.findIndex((chapter) => chapter.id === chapterId);
  if (index === -1) return null;
  return { book, chapters, index };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const found = await load(props);
  if (!found) return {};
  const chapter = found.chapters[found.index];
  return {
    title: `${chapter.title} · ${found.book.title}`,
    description: excerpt(chapter.content),
  };
}

export default async function ChapterPage(props: Props) {
  const found = await load(props);
  if (!found) notFound();

  const { book, chapters, index } = found;
  const chapter = chapters[index];
  const prev = chapters[index - 1];
  const next = chapters[index + 1];

  const pager = (
    <nav className="lib-pager" aria-label="Chuyển chương">
      {prev ? (
        <Link href={`/books/${book.id}/${prev.id}`} rel="prev" className="lib-prev">
          <ChevronLeft size={16} strokeWidth={1.5} /> Chương trước
        </Link>
      ) : (
        <span />
      )}
      <Link href={`/books/${book.id}`} className="lib-toc">Mục lục</Link>
      {next ? (
        <Link href={`/books/${book.id}/${next.id}`} rel="next" className="lib-next">
          Chương sau <ChevronRight size={16} strokeWidth={1.5} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );

  return (
    <article className="lib lib-read">
      <Link href={`/books/${book.id}`} className="lib-back">
        <ChevronLeft size={16} strokeWidth={1.5} /> {book.title}
      </Link>

      <header className="lib-chapter-head">
        <p className="lib-kicker">Chương {index + 1} / {chapters.length}</p>
        <h1>{chapter.title}</h1>
      </header>

      <Markdown>{chapter.content || "*Chương này chưa có nội dung.*"}</Markdown>

      {pager}
    </article>
  );
}
