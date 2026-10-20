import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StaffDivider } from "@/components/Art";
import { fmtDate, readMinutes } from "@/lib/utils";

export const revalidate = 60;

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: post } = await supabase
    .from("posts").select("*").eq("id", id).single();

  if (!post) notFound();

  return (
    <article className="article">
      <Link href="/" className="muted">
        <ChevronLeft size={18} strokeWidth={1.25} style={{ verticalAlign: "-4px" }} />
        Về danh sách
      </Link>
      <div className="meta" style={{ marginTop: 14 }}>
        <span className="pill">{post.tag || "Chưa phân loại"}</span>
        <span>{fmtDate(post.created_at)}</span>
        <span>{readMinutes(post.body)} phút đọc</span>
      </div>
      <h1>{post.title}</h1>
      <StaffDivider small />
      <div className="md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>
    </article>
  );
}