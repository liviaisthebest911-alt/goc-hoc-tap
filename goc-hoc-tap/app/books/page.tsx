import type { Metadata } from "next";
import StoryShelf from "@/components/StoryShelf";
import { listBooks } from "@/lib/books";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Liu's Book",
  description: "Những câu chuyện do Liu sáng tác.",
};

export default async function BooksPage() {
  const stories = await listBooks();

  return (
    <div className="lib lib-wide">
      <header className="lib-head">
        <h1>Liu&apos;s Book</h1>
        <p className="lib-lead">Những câu chuyện nhỏ do mình viết, đăng dần theo từng chương.</p>
      </header>
      <StoryShelf stories={stories} />
    </div>
  );
}
