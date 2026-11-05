import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import TopicList from "@/components/TopicList";
import { listPosts, listTopics } from "@/lib/posts";

export const revalidate = 60;

type Props = { params: Promise<{ tag: string }> };

function decodeTag(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeTag((await params).tag);
  return tag ? { title: tag } : {};
}

export default async function TopicPage({ params }: Props) {
  const tag = decodeTag((await params).tag);
  if (!tag) notFound();

  const posts = await listPosts();
  const matching = posts.filter((post) => post.tag === tag);
  if (matching.length === 0) notFound();

  return (
    <div className="page wide">
      <p className="eyebrow">Chủ đề</p>
      <h1>{tag}</h1>
      <TopicList topics={listTopics(posts)} active={tag} />
      <section className="cards">
        {matching.map((post) => <PostCard key={post.id} post={post} />)}
      </section>
    </div>
  );
}
