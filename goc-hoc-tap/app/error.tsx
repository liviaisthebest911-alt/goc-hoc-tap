"use client";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <div className="page narrow">
      <h1>Không tải được nội dung</h1>
      <p className="muted">Kết nối tới dữ liệu đang gặp sự cố. Hãy thử lại sau ít phút.</p>
      <button className="btn" onClick={() => retry()}>Thử lại</button>
    </div>
  );
}
