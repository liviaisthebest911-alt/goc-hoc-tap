import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { requireAdmin } from "@/lib/auth";
import { getPost, listPosts, listTopics } from "@/lib/posts";
import { toDateInput } from "@/lib/utils";

export const metadata: Metadata = { title: "Sửa bài viết", robots: { index: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  const topics = listTopics(await listPosts()).map(([topic]) => topic);

  return (
    <div className="page">
      <h1>Sửa bài viết</h1>
      <PostEditor post={post} initialDate={toDateInput(post.created_at)} topics={topics} />
    </div>
  );
}
