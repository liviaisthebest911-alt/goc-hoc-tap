import Link from "next/link";
import Mascot, { MASCOTS } from "./Mascot";
import NowPlaying, { LiveScore } from "./NowPlaying";
import { Violin } from "./Art";
import { SCALE } from "@/lib/synth";
import type { loadHome } from "@/lib/site";

type Home = Awaited<ReturnType<typeof loadHome>>;

export default function Hero({ home }: { home: Home }) {
  const { stats, shelf, moments, melody, quote } = home;
  const shelfTotal = shelf.reading + shelf.want + shelf.finished;
  const contents = [
    { href: "#bai-viet", label: "Góc học tập", note: `${stats.posts} bài viết` },
    { href: "/books", label: "Liu's Book", note: `${stats.stories} truyện` },
    { href: "/shelf", label: "Kệ sách", note: shelfTotal > 0 ? `${shelfTotal} cuốn` : "đang chờ cuốn đầu" },
    { href: "#little-moments", label: "Little Moments", note: `${moments.length} nốt nhạc` },
    { href: "#bang-hoc", label: "Bảng học tập", note: `${stats.topics} chủ đề` },
    { href: "#music-corner", label: "Music Corner", note: `${SCALE.length} phím đàn` },
  ];

  return (
    <section id="ve-toi" className="hero">
      <nav className="hero-contents" aria-label="Trong số này">
        <h2>Trong số này</h2>
        <ol>
          {contents.map(({ href, label, note }) => (
            <li key={label}>
              <Link href={href}>
                <span>{label}</span>
                <small>{note}</small>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="hero-copy">
        <h1>
          A little <em>world</em> of&nbsp;Liu
        </h1>
        <Mascot src={MASCOTS.reader} alt="Mascot tóc đen của Liu" className="hero-avatar" />
        <p className="hero-tagline">Learning, building, and growing — one step at a time.</p>
        <p className="hero-intro">
          Mình là Liu June Máth. Đây là góc nhỏ trên internet nơi mình ghi lại những gì đã học,
          chia sẻ ý tưởng và theo dõi những thứ mình đang xây dựng.
        </p>
        <div className="hero-actions">
          <Link href="#little-moments" className="btn">Explore my journey</Link>
          <Link href="#bai-viet" className="btn ghost">Read articles</Link>
        </div>
      </div>

      <aside className="hero-rail">
        <NowPlaying melody={melody} />
        <figure className="daily-quote">
          <blockquote>{quote.text}</blockquote>
          <figcaption><cite>{quote.source}</cite>, câu của hôm nay</figcaption>
        </figure>
      </aside>

      <div className="hero-deco">
        <div className="deco-violin" aria-hidden="true"><Violin className="violin" /></div>
        <span className="glyph g-brace" aria-hidden="true" data-depth="24">{"{ }"}</span>
        <span className="glyph g-tag" aria-hidden="true" data-depth="18">{"</>"}</span>
        <p className="bits"><code>01001100 01101001</code> là chữ Li</p>
      </div>

      <LiveScore className="hero-score" />
    </section>
  );
}
