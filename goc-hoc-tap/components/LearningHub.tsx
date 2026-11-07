"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dices, Search, X } from "lucide-react";
import type { PostSummary } from "@/lib/site";
import { pitchOf } from "@/lib/synth";
import { fold, queryWords, topicHref } from "@/lib/utils";

/* Bố cục bất đối xứng lặp lại theo nhịp 3 hàng sau bài chính. */
const RHYTHM = ["span-5", "span-7", "span-4", "span-4", "span-4"];

function slotOf(index: number, total: number) {
  if (index === 0) return total === 1 ? "lead solo" : "lead";
  if (index === 1) return "second";
  return RHYTHM[(index - 2) % RHYTHM.length];
}

/* Bài không có ảnh: tiêu đề tự viết thành một dòng nhạc, mỗi từ là một nốt. */
function TitleStaff({ title }: { title: string }) {
  const notes = title.split(/\s+/).slice(0, 10);
  return (
    <svg className="title-staff" viewBox="0 0 320 120" aria-hidden="true">
      {[30, 44, 58, 72, 86].map((y) => <path key={y} d={`M0 ${y}H320`} stroke="currentColor" opacity=".5" />)}
      {notes.map((word, i) => {
        const x = 26 + (i * 276) / Math.max(1, notes.length - 1 || 1);
        const y = 86 - pitchOf(word) * 7;
        return (
          <g key={i}>
            <path d={`M${x + 6} ${y}V${y - 30}`} stroke="currentColor" strokeWidth="1.6" />
            <ellipse cx={x} cy={y} rx="7" ry="5" fill="currentColor" transform={`rotate(-20 ${x} ${y})`} />
          </g>
        );
      })}
    </svg>
  );
}

function Article({ post, slot, featured }: { post: PostSummary; slot: string; featured: boolean }) {
  const large = slot.startsWith("lead") || slot === "second";
  return (
    <article className={`story ${slot}`}>
      {(large || post.cover) && (
        <div className="story-cover">
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- ảnh do Admin dán, có thể từ bất kỳ host nào
            <img src={post.cover} alt="" loading="lazy" decoding="async" />
          ) : (
            <TitleStaff title={post.title} />
          )}
          {featured && <span className="ribbon">Featured</span>}
        </div>
      )}
      <div className="story-body">
        <h3>
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="story-excerpt">{post.excerpt}</p>
        <div className="meta">
          {post.tag && <Link href={topicHref(post.tag)} className="tag">{post.tag}</Link>}
          <time dateTime={post.iso}>{post.dateLabel}</time>
          <span>{post.minutes} phút đọc</span>
        </div>
      </div>
    </article>
  );
}

export default function LearningHub({
  posts,
  topics,
}: {
  posts: PostSummary[];
  topics: { name: string; count: number }[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);

  const visible = useMemo(() => {
    const words = queryWords(query);
    return posts.filter((post) => {
      if (topic && post.tag !== topic) return false;
      const haystack = fold(`${post.title} ${post.tag ?? ""} ${post.excerpt}`) + ` ${post.keywords}`;
      return words.every((word) => haystack.includes(word));
    });
  }, [posts, query, topic]);

  function reset() {
    setQuery("");
    setTopic(null);
  }

  function randomArticle() {
    const pool = visible.length > 0 ? visible : posts;
    router.push(`/posts/${pool[Math.floor(Math.random() * pool.length)].id}`);
  }

  if (posts.length === 0) return <p className="empty">Chưa có bài viết nào.</p>;

  return (
    <>
      <div className="hub-tools">
        <div className="chips" role="group" aria-label="Lọc theo chủ đề">
          <button type="button" aria-pressed={!topic} onClick={() => setTopic(null)}>
            Tất cả <span>{posts.length}</span>
          </button>
          {topics.map(({ name, count }) => (
            <button key={name} type="button" aria-pressed={topic === name} onClick={() => setTopic(name)}>
              {name} <span>{count}</span>
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={17} strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">Tìm bài viết</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm tiêu đề, chủ đề, nội dung"
          />
        </label>
        <button type="button" className="btn ghost random" onClick={randomArticle}>
          <Dices size={17} strokeWidth={1.5} /> Bài ngẫu nhiên
        </button>
      </div>

      <p className="sr-only" role="status">{visible.length} bài viết phù hợp</p>

      {visible.length > 0 ? (
        <div className="hub-grid">
          {visible.map((post, i) => (
            <Article
              key={post.id}
              post={post}
              slot={slotOf(i, visible.length)}
              featured={post.id === posts[0].id}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>Không có bài nào khớp với tìm kiếm này.</p>
          <button type="button" className="btn ghost" onClick={reset}>
            <X size={16} strokeWidth={1.5} /> Xóa bộ lọc
          </button>
        </div>
      )}
    </>
  );
}
