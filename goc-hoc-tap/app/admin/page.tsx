import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, PenLine } from "lucide-react";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import LogoutButton from "@/components/LogoutButton";
import { requireAdmin } from "@/lib/auth";
import { listPosts } from "@/lib/posts";
import { fmtDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false } };

export default async function AdminPage() {
  await requireAdmin();
  const posts = await listPosts();

  return (
    <div className="page">
      <div className="page-head">
        <h1>Quản trị bài viết</h1>
        <div className="form-actions">
          <Link href="/write" className="btn">
            <PenLine size={16} strokeWidth={1.5} /> Viết bài mới
          </Link>
          <Link href="/admin/books" className="btn ghost">
            <BookOpen size={16} strokeWidth={1.5} /> Liu&apos;s Book
          </Link>
          <LogoutButton />
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="empty">Chưa có bài viết nào.</p>
      ) : (
        <ul className="admin-list">
          {posts.map((post) => (
            <li key={post.id}>
              <div>
                <Link href={`/posts/${post.id}`} className="admin-title">{post.title}</Link>
                <p className="muted">
                  {fmtDate(post.created_at)} · {post.tag || "Chưa phân loại"}
                </p>
              </div>
              <div className="admin-actions">
                <Link href={`/write/${post.id}`}>Sửa</Link>
                <ConfirmDeleteButton
                  url={`/api/posts/${encodeURIComponent(post.id)}`}
                  confirmText={`Xóa vĩnh viễn bài "${post.title}"?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
