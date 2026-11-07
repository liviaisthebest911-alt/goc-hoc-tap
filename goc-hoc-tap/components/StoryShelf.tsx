import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Book } from "@/lib/books";

export type Story = Book & { chapter_count: number };

/** Dãy bìa truyện đứng trên một tấm kệ. Bìa dựng từ tên truyện, không cần ảnh. */
export default function StoryShelf({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return <p className="empty">Chưa có truyện nào được đăng.</p>;
  return (
    <ul className="shelf-row">
      {stories.map((story) => (
        <li key={story.id}>
          <Link href={`/books/${story.id}`} className="cover">
            <span className="cover-title">{story.title}</span>
            <span className="cover-rule" aria-hidden="true" />
            <span className="cover-foot">
              {story.chapter_count} chương <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
