import Link from "next/link";
import Mascot, { MASCOTS } from "./Mascot";
import { HeroScore, Notes, PianoKeys, Star, Violin } from "./Art";

/*
 * Mỗi phần tử parallax gồm hai lớp: lớp ngoài nhận data-depth (JS ghi transform),
 * lớp trong chạy animation nổi, để hai transform không đè lên nhau.
 */
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Hello, I&apos;m Liu June Máth.</h1>
        <p className="hero-tagline">Learning, building, and growing — one step at a time.</p>
        <div className="hero-actions">
          <Link href="/#ve-toi" className="btn">Explore my journey</Link>
          <Link href="/#bai-viet" className="btn ghost">Đọc bài viết</Link>
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="art-slot mascot-slot" data-depth="10">
          <div className="float slow"><Mascot src={MASCOTS.reader} className="mascot-hero" /></div>
        </div>
        <div className="art-slot violin-slot" data-depth="16">
          <div className="float">
            <Violin className="violin" />
          </div>
        </div>
        <div className="art-slot keys-slot" data-depth="8">
          <div className="float slow">
            <PianoKeys className="keys" />
          </div>
        </div>
        <div className="art-slot star-slot" data-depth="26">
          <div className="float fast"><Star className="doodle star" /></div>
        </div>
        <div className="art-slot notes-slot" data-depth="22">
          <div className="float slow"><Notes className="doodle" /></div>
        </div>
        <div className="art-slot brace-slot" data-depth="30">
          <span className="glyph">{"{ }"}</span>
        </div>
        <div className="art-slot tag-slot" data-depth="12">
          <span className="glyph small">{"</>"}</span>
        </div>
      </div>

      <HeroScore className="hero-score" />
    </section>
  );
}
