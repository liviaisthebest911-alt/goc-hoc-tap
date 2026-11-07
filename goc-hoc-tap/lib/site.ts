import { cache } from "react";
import { learning, moments as manualMoments } from "@/data/moments";
import { finished, reading, wantToRead } from "@/data/shelf";
import { quotes } from "@/data/quotes";
import { listBooks } from "@/lib/books";
import { listPosts, listTopics } from "@/lib/posts";
import { pitchOf, type Melody } from "@/lib/synth";
import { dayNumber, excerpt, firstImage, fmtLong, keywords, readMinutes, topicHref } from "@/lib/utils";

/** Bản rút gọn gửi xuống client: không kèm nội dung bài. */
export type PostSummary = {
  id: string;
  title: string;
  tag: string | null;
  excerpt: string;
  /** Từ khóa rút gọn từ nội dung, để tìm kiếm mà không gửi cả bài xuống trình duyệt. */
  keywords: string;
  cover: string | null;
  dateLabel: string;
  iso: string;
  minutes: number;
};

export type Moment = {
  id: string;
  title: string;
  kindLabel: string;
  /** Nốt đặc là 1 (học tập), nốt rỗng là 0 (sáng tác và đời thường). */
  filled: boolean;
  degree: number;
  dateLabel: string;
  iso: string;
  href?: string;
};

const MANUAL_LABEL = {
  milestone: "Cột mốc",
  project: "Dự án",
  skill: "Kỹ năng",
  memory: "Khoảnh khắc",
} as const;

export const loadHome = cache(async () => {
  const [posts, stories] = await Promise.all([listPosts(), listBooks()]);

  const summaries: PostSummary[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    tag: post.tag,
    excerpt: excerpt(post.body, 200),
    keywords: keywords(post.body),
    cover: firstImage(post.body),
    dateLabel: fmtLong(post.created_at),
    iso: post.created_at,
    minutes: readMinutes(post.body),
  }));

  const topics = listTopics(posts);

  const moments: Moment[] = [
    ...posts.map((post) => ({
      id: post.id,
      title: post.title,
      kindLabel: post.tag ? `Học tập · ${post.tag}` : "Học tập",
      filled: true,
      degree: pitchOf(post.id),
      dateLabel: fmtLong(post.created_at),
      iso: post.created_at,
      href: `/posts/${post.id}`,
    })),
    ...stories.map((book) => ({
      id: book.id,
      title: book.title,
      kindLabel: "Truyện",
      filled: false,
      degree: pitchOf(book.id),
      dateLabel: fmtLong(book.created_at),
      iso: book.created_at,
      href: `/books/${book.id}`,
    })),
    ...manualMoments.map((m) => {
      const iso = new Date(`${m.date}T12:00:00+07:00`).toISOString();
      return {
        id: `${m.date}-${m.title}`,
        title: m.title,
        kindLabel: MANUAL_LABEL[m.kind],
        filled: m.kind === "milestone" || m.kind === "skill",
        degree: pitchOf(m.title),
        dateLabel: fmtLong(iso),
        iso,
        href: m.href,
      };
    }),
  ].sort((a, b) => a.iso.localeCompare(b.iso));

  const melody: Melody = moments.map((m) => ({ id: m.id, degree: m.degree, label: m.title }));

  const byTopic = topics
    .map(([name, count]) => ({
      name,
      count,
      minutes: summaries.filter((p) => p.tag === name).reduce((sum, p) => sum + p.minutes, 0),
      href: topicHref(name),
    }))
    .sort((a, b) => b.count - a.count || b.minutes - a.minutes);

  return {
    posts: summaries,
    stories,
    moments,
    melody,
    byTopic,
    skills: learning,
    quote: quotes[dayNumber() % quotes.length],
    stats: {
      posts: posts.length,
      topics: topics.length,
      minutes: summaries.reduce((sum, p) => sum + p.minutes, 0),
      stories: stories.length,
      chapters: stories.reduce((sum, s) => sum + s.chapter_count, 0),
      uncategorized: posts.filter((p) => !p.tag).length,
    },
    shelf: { reading: reading.length, want: wantToRead.length, finished: finished.length },
  };
});
