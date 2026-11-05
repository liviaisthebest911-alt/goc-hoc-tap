import type { Metadata } from "next";
import PostEditor from "@/components/PostEditor";
import { requireAdmin } from "@/lib/auth";
import { listPosts, listTopics } from "@/lib/posts";
import { toDateInput } from "@/lib/utils";

export const metadata: Metadata = { title: "Viết bài mới", robots: { index: false } };

export default async function WritePage() {
  await requireAdmin();
  const topics = listTopics(await listPosts()).map(([topic]) => topic);

  return (
    <div className="page">
      <h1>Viết bài mới</h1>
      <PostEditor initialDate={toDateInput(new Date().toISOString())} topics={topics} />
    </div>
  );
}
