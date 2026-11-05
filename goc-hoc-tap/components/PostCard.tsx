import Link from "next/link";
import { excerpt, fmtDate, readMinutes, topicHref } from "@/lib/utils";
import type { Post } from "@/lib/posts";
import Tilt from "./Tilt";

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Tilt className={featured ? "featured" : ""}>
      <article className={`post-card${featured ? " featured" : ""}`}>
        <p className="post-date">
          <time dateTime={post.created_at}>{fmtDate(post.created_at)}</time>
        </p>
        <h3><Link href={`/posts/${post.id}`}>{post.title}</Link></h3>
        <p className="post-excerpt">{excerpt(post.body, featured ? 220 : 150)}</p>
        <div className="meta">
          {post.tag && <Link href={topicHref(post.tag)} className="tag">{post.tag}</Link>}
          <span>{readMinutes(post.body)} phút đọc</span>
        </div>
      </article>
    </Tilt>
  );
}
