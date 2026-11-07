/* Nhạc tổng hợp ngay trên trình duyệt: không tải tệp âm thanh, chỉ kêu khi người xem bấm. */

export const SCALE = [
  { name: "Đô", key: "a", hz: 261.63 },
  { name: "Rê", key: "s", hz: 293.66 },
  { name: "Mi", key: "d", hz: 329.63 },
  { name: "Fa", key: "f", hz: 349.23 },
  { name: "Sol", key: "g", hz: 392.0 },
  { name: "La", key: "h", hz: 440.0 },
  { name: "Si", key: "j", hz: 493.88 },
  { name: "Đô cao", key: "k", hz: 523.25 },
] as const;

export type Melody = { id: string; degree: number; label: string }[];
export type Playing = { id?: string; label: string; melody: boolean; step?: number; degree: number } | null;

/** Cùng một nội dung luôn ra cùng một nốt. */
export function pitchOf(seed: string) {
  let sum = 0;
  for (const ch of seed) sum = (sum * 31 + ch.codePointAt(0)!) % 9973;
  return sum % SCALE.length;
}

let ctx: AudioContext | null = null;
let current: Playing = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function publish(next: Playing) {
  current = next;
  listeners.forEach((fn) => fn());
}

export const subscribePlaying = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};
export const getPlaying = () => current;
export const getNoPlaying = (): Playing => null;

function tone(hz: number, seconds = 1.1) {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime;
  osc.type = "triangle";
  osc.frequency.value = hz;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.16, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + seconds);
}

export function playNote(degree: number) {
  clearTimeout(timer);
  const note = SCALE[degree];
  tone(note.hz);
  publish({ label: `Nốt ${note.name}`, melody: false, degree });
  timer = setTimeout(() => publish(null), 1400);
}

export function stopPlaying() {
  clearTimeout(timer);
  publish(null);
}

export function playMelody(melody: Melody, stepMs = 620) {
  clearTimeout(timer);
  const step = (i: number) => {
    if (i >= melody.length) return publish(null);
    const { id, degree, label } = melody[i];
    tone(SCALE[degree].hz);
    publish({ id, label, melody: true, step: i, degree });
    timer = setTimeout(() => step(i + 1), stepMs);
  };
  step(0);
}
