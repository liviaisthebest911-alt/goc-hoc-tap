import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import TopicList from "@/components/TopicList";
import { Book, Star } from "@/components/Art";
import { listPosts, listTopics } from "@/lib/posts";

export const revalidate = 60;

export default async function Home() {
  const posts = await listPosts();

  return (
    <>
      <Hero />

      <section id="bai-viet" className="section">
        <div className="section-head">
          <h2>Bài viết</h2>
          <span className="hand">viết chậm, học kỹ</span>
        </div>
        <TopicList topics={listTopics(posts)} />
        {posts.length > 0 ? (
          <div className="cards">
            {posts.map((post, i) => (
              <Reveal key={post.id} className={i === 0 ? "featured-slot" : ""} delay={i > 0 ? (i % 2) * 90 : 0}>
                <PostCard post={post} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="empty">Chưa có bài viết nào.</p>
        )}
      </section>

      <section id="ve-toi" className="section">
        <Reveal>
          <div className="about-sheet">
            <Star className="doodle about-star" />
            <h2>Về tôi</h2>
            <p className="about">
              This is my little corner of the internet, where I document what I learn, share ideas,
              and keep track of the things I&apos;m building along the way.
            </p>
            <Book className="doodle about-book" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
