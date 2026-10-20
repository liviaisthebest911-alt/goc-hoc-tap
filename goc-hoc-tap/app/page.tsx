import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import { StaffDivider, Violin, SheetMusic } from "@/components/Art";

export const revalidate = 60;

export default async function Home() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <section className="hero">
        <div>
          <h1>Chào bạn, mình là Minh Anh.</h1>
          <p>
            Mình đang học khoa học máy tính, toán và violin. Ở đây mình ghi lại
            những gì mới hiểu ra, theo cách dễ đọc nhất có thể.
          </p>
          <Link href="/#ve-toi" className="btn">Về hành trình của mình</Link>
        </div>
        <Violin className="violin" />
      </section>

      <StaffDivider />

      <section>
        {posts && posts.length > 0 ? (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        ) : (
          <div className="empty">
            <SheetMusic className="" />
            <p>Chưa có bài viết nào. Hãy viết bài đầu tiên.</p>
          </div>
        )}
      </section>

      <StaffDivider />

      <section id="ve-toi">
        <h2 style={{ fontSize: 40 }}>Về tôi</h2>
        <p className="muted" style={{ maxWidth: "56ch" }}>
          Mình là sinh viên, thích học chậm và ghi lại cẩn thận. Ngoài giờ học,
          mình tập violin mỗi tối. Kỹ năng: HTML, CSS, JavaScript, Python.
          Đang nghiên cứu: cấu trúc dữ liệu, giải tích, xác suất.
        </p>
      </section>
    </>
  );
}