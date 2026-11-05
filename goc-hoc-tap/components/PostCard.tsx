import Link from "next/link";
import { excerpt, fmtDate, readMinutes, topicHref } from "@/lib/utils";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-row">
      <p className="post-date">
        <time dateTime={post.created_at}>{fmtDate(post.created_at)}</time>
      </p>
      <div>
        <h3><Link href={`/posts/${post.id}`}>{post.title}</Link></h3>
        <p className="post-excerpt">{excerpt(post.body)}</p>
        <div className="meta">
          {post.tag && <Link href={topicHref(post.tag)} className="tag">{post.tag}</Link>}
          <span>{readMinutes(post.body)} phút đọc</span>
        </div>
      </div>
    </article>
  );
}
