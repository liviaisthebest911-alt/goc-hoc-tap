import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Markdown from "@/components/Markdown";
import ReadingProgress from "@/components/ReadingProgress";
import { getPost } from "@/lib/posts";
import { excerpt, fmtDate, readMinutes, topicHref } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).id);
  return post ? { title: post.title, description: excerpt(post.body) } : {};
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <article className="article">
      <ReadingProgress />
      <Link href="/#bai-viet" className="back">
        <ChevronLeft size={16} strokeWidth={1.5} /> Về danh sách
      </Link>
      <header>
        <div className="meta">
          {post.tag && <Link href={topicHref(post.tag)} className="tag">{post.tag}</Link>}
          <time dateTime={post.created_at}>{fmtDate(post.created_at)}</time>
          <span>{readMinutes(post.body)} phút đọc</span>
        </div>
        <h1>{post.title}</h1>
      </header>
      <Markdown>{post.body}</Markdown>
    </article>
  );
}
