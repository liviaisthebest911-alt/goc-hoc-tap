import Link from "next/link";
import PostCard from "@/components/PostCard";
import TopicList from "@/components/TopicList";
import { Violin } from "@/components/Art";
import { listPosts, listTopics } from "@/lib/posts";

export const revalidate = 60;

export default async function Home() {
  const posts = await listPosts();

  return (
    <>
      <section className="hero">
        <div>
          <h1>Hello, I&apos;m Liu June Máth.</h1>
          <p>Learning, building, and growing — one step at a time.</p>
          <Link href="/#ve-toi" className="btn">Explore my journey</Link>
        </div>
        <Violin className="violin" />
      </section>

      <section id="bai-viet" className="section">
        <h2>Bài viết</h2>
        <TopicList topics={listTopics(posts)} />
        {posts.length > 0 ? (
          <div className="post-list">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p className="empty">Chưa có bài viết nào.</p>
        )}
      </section>

      <section id="ve-toi" className="section">
        <h2>Về tôi</h2>
        <p className="muted about">
          This is my little corner of the internet, where I document what I learn, share ideas,
          and keep track of the things I&apos;m building along the way.
        </p>
      </section>
    </>
  );
}
