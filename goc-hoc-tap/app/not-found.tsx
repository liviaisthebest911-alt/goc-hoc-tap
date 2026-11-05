import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page narrow">
      <h1>Không tìm thấy trang</h1>
      <p className="muted">Trang này không tồn tại hoặc bài viết đã bị xóa.</p>
      <Link href="/" className="btn">Về trang chủ</Link>
    </div>
  );
}
