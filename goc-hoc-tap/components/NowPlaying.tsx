"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Play, Square } from "lucide-react";
import { BIT_COUNT, HeroScore, PianoKeys } from "./Art";
import {
  getNoPlaying,
  getPlaying,
  playMelody,
  stopPlaying,
  subscribePlaying,
  type Melody,
} from "@/lib/synth";

export function usePlaying() {
  return useSyncExternalStore(subscribePlaying, getPlaying, getNoPlaying);
}

export function PlayMelody({ melody, className }: { melody: Melody; className: string }) {
  const playing = usePlaying();
  if (melody.length === 0) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => (playing?.melody ? stopPlaying() : playMelody(melody))}
    >
      {playing?.melody ? <Square size={14} strokeWidth={1.5} /> : <Play size={14} strokeWidth={1.5} />}
      {playing?.melody ? "Dừng" : "Nghe khuông nhạc"}
    </button>
  );
}

export function LiveScore({ className }: { className: string }) {
  const playing = usePlaying();
  return <HeroScore className={className} active={playing?.melody ? playing.step! % BIT_COUNT : -1} />;
}

export default function NowPlaying({ melody }: { melody: Melody }) {
  const playing = usePlaying();
  useEffect(() => stopPlaying, []); // rời trang chủ thì không còn nút Dừng, nên phải dừng tại đây

  return (
    <section className="now-playing" aria-label="Now Playing">
      <PianoKeys className="np-keys" active={playing?.degree ?? -1} />
      <h2>Now Playing</h2>
      <p className="np-track" aria-live="polite">
        {playing ? playing.label : "Đang yên lặng"}
      </p>
      <PlayMelody melody={melody} className="np-btn" />
    </section>
  );
}
