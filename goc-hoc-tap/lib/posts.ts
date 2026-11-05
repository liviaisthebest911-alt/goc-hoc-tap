import { cache } from "react";
import { supabase } from "@/lib/supabase";

export type Post = {
  id: string;
  title: string;
  tag: string | null;
  body: string;
  created_at: string;
};

/** Mã lỗi Postgres khi id không đúng kiểu cột, nghĩa là bài không tồn tại. */
const INVALID_TEXT_REPRESENTATION = "22P02";

export async function listPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Không tải được danh sách bài viết: ${error.message}`);
  return data;
}

export const getPost = cache(async (id: string): Promise<Post | null> => {
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error?.code === INVALID_TEXT_REPRESENTATION) return null;
  if (error) throw new Error(`Không tải được bài viết: ${error.message}`);
  return data;
});

export function listTopics(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const { tag } of posts) {
    if (tag) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b, "vi"));
}
