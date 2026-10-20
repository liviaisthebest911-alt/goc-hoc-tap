import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { SheetMusic } from "./Art";
import { excerpt, fmtDate, readMinutes } from "@/lib/utils";

type Post = { id: string; title: string; tag: string | null; body: string; created_at: string };

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.id}`} className="card">
      <SheetMusic className="bg" />
      <div className="meta">
        <span className="pill">{post.tag || "Chưa phân loại"}</span>
        <span><Calendar size={16} strokeWidth={1.25} /> {fmtDate(post.created_at)}</span>
        <span><Clock size={16} strokeWidth={1.25} /> {readMinutes(post.body)} phút đọc</span>
      </div>
      <h2>{post.title}</h2>
      <p>{excerpt(post.body)}</p>
    </Link>
  );
}