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
          <h1>Hello, I'm Liu June Máth.</h1>
          <p>

          </p>
          <Link href="/aboutme" className="btn">Explore my journey</Link>
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

      <section id="About Me">
        <h2 style={{ fontSize: 40 }}>Về tôi</h2>
        <p className="muted" style={{ maxWidth: "56ch" }}>
          Learning, building, and growing — one step at a time.
This is my little corner of the internet, where I document what I learn, share ideas, and keep track of the things I'm building along the way.
        </p>
      </section>
    </>
  );
}