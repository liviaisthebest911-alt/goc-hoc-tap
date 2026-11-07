import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import LearningHub from "@/components/LearningHub";
import LittleMoments from "@/components/LittleMoments";
import { PlayMelody } from "@/components/NowPlaying";
import Mascot, { MASCOTS } from "@/components/Mascot";
import MusicCorner from "@/components/MusicCorner";
import Reveal from "@/components/Reveal";
import StoryShelf from "@/components/StoryShelf";
import { loadHome } from "@/lib/site";

export const revalidate = 60;

export default async function Home() {
  const home = await loadHome();
  const { stats, byTopic, shelf } = home;
  const top = byTopic[0]?.count ?? 1;
  const shelfTotal = shelf.reading + shelf.want + shelf.finished;

  return (
    <>
      <Hero home={home} />

      <section id="bai-viet" className="section">
        <div className="section-head">
          <h2>Góc học tập</h2>
          <p>Viết chậm, học kỹ. Những ghi chép mình muốn đọc lại.</p>
        </div>
        <LearningHub posts={home.posts} topics={byTopic} />
      </section>

      <section id="liu-book" className="section band">
        <Reveal className="band-grid">
          <div className="band-copy">
            <h2>Liu&apos;s Book</h2>
            <p>Những câu chuyện nhỏ do mình viết, đăng dần theo từng chương.</p>
            <Link href="/books" className="more">
              Vào thư viện <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <Mascot src={MASCOTS.buddy} alt="Mascot tóc cam của Liu" className="band-mascot" />
          </div>
          <div>
            <StoryShelf stories={home.stories} />
            <Link href="/shelf" className="shelf-note">
              <span>Kệ sách đọc</span>
              <small>
                {shelfTotal > 0
                  ? `${shelf.reading} đang đọc · ${shelf.want} muốn đọc · ${shelf.finished} đã đọc`
                  : "Kệ đang chờ cuốn sách đầu tiên"}
              </small>
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section id="little-moments" className="section">
        <div className="section-head">
          <h2>Little Moments</h2>
          <div className="head-side">
            <p>Mỗi nốt là một điều đã thật sự xảy ra. Nốt đặc là bài học, nốt rỗng là truyện.</p>
            <PlayMelody melody={home.melody} className="btn ghost" />
          </div>
        </div>
        <LittleMoments moments={home.moments} />
        {home.skills.length > 0 && (
          <p className="learning">
            <span>Đang học</span>
            {home.skills.map((skill) => <b key={skill}>{skill}</b>)}
          </p>
        )}
      </section>

      <div className="split">
        <section id="bang-hoc" className="section ledger">
          <h2>Bảng học tập</h2>
          <p className="ledger-line">
            Đến nay đã có <b>{stats.posts}</b> bài viết trong <b>{stats.topics}</b> chủ đề, cần{" "}
            <b>{stats.minutes}</b> phút để đọc hết, cùng <b>{stats.stories}</b> truyện với{" "}
            <b>{stats.chapters}</b> chương.
          </p>
          {byTopic.length > 0 && (
            <>
              <h3>Bài viết theo chủ đề</h3>
              <ul className="bars">
                {byTopic.map(({ name, count, minutes, href }) => (
                  <li key={name}>
                    <Link href={href}>{name}</Link>
                    <span className="bar"><span style={{ width: `${(count / top) * 100}%` }} /></span>
                    <span className="bar-value">{count} bài · {minutes} phút</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {stats.uncategorized > 0 && (
            <p className="muted">{stats.uncategorized} bài chưa phân loại.</p>
          )}
        </section>

        <section id="music-corner" className="section music">
          <h2>Music Corner</h2>
          <MusicCorner />
        </section>
      </div>
    </>
  );
}
