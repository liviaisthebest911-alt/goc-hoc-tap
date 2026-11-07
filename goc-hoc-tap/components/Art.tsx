/*
 * Bộ hình minh họa dùng chung một nét vẽ: đường mảnh, bo tròn, màu lấy từ currentColor.
 * Các nhóm có class (.bow, .string, .key) để CSS tạo chuyển động khi rê chuột.
 */
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Props = { className?: string };

export function Violin({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 260 420" aria-hidden="true">
      <defs>
        <linearGradient id="violin-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".16" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".05" />
        </linearGradient>
      </defs>
      <g {...base} strokeWidth={1.6}>
        {/* thân đàn */}
        <path
          fill="url(#violin-wood)"
          d="M120 186c-26 0-44 14-44 36c0 14 8 22 14 30c4 6 4 14-2 22c-10 12-22 20-22 46c0 28 22 46 54 46s54-18 54-46c0-26-12-34-22-46c-6-8-6-16-2-22c6-8 14-16 14-30c0-22-18-36-44-36z"
        />
        <path
          d="M120 194c-20 0-34 10-34 28c0 12 8 20 12 28M120 194c20 0 34 10 34 28c0 12-8 20-12 28"
          opacity=".35"
        />
        <path d="M100 276c-7 10-7 22 0 34M140 276c7 10 7 22 0 34" />
        <path d="M106 308h28M110 308l-2-8h24l-2 8" opacity=".85" />
        <path d="M113 372l7-60 7 60z" opacity=".6" />
        {/* cần đàn, hộp trục và đầu xoắn */}
        <path d="M113 68h14l4 160h-22z" />
        <path d="M114 68V44h12v24M107 54h7M107 62h7M126 54h7M126 62h7" />
        <path d="M120 44c-11-2-13-17-3-19c8-1 10 8 3 10c-4 1-6-3-3-5" />
        {/* dây: rung nhẹ khi rê chuột */}
        <g className="string" strokeWidth={1} opacity=".75">
          <path d="M115.5 70L113 312" />
          <path d="M118.5 70L117.5 312" />
          <path d="M121.5 70L122.5 312" />
          <path d="M124.5 70L127 312" />
        </g>
        {/* vĩ kéo: trượt ngang qua dây */}
        <g className="bow">
          <path d="M26 312Q130 290 234 312" strokeWidth={1.8} />
          <path d="M30 316Q130 296 230 316" strokeWidth={1} opacity=".5" />
          <path d="M214 306l14 8-6 6-14-8z" fill="currentColor" fillOpacity=".25" />
          <path d="M26 312l-6-3" />
        </g>
      </g>
    </svg>
  );
}

const WHITE = 8;
const KEY_W = 44;
const BLACK_AFTER = [0, 1, 3, 4, 5];

export function PianoKeys({ className, active = -1 }: Props & { active?: number }) {
  return (
    <svg className={className} viewBox="0 0 360 130" aria-hidden="true">
      <g {...base} strokeWidth={2}>
        {Array.from({ length: WHITE }, (_, i) => (
          <rect key={i} className={i === active ? "key-on" : undefined} x={6 + i * KEY_W} y={8} width={KEY_W - 3} height={112} rx={5} />
        ))}
        {BLACK_AFTER.map((i) => (
          <rect key={i} x={6 + (i + 1) * KEY_W - 15} y={8} width={25} height={68} rx={3} fill="currentColor" />
        ))}
      </g>
    </svg>
  );
}

/**
 * Khuông nhạc mà nốt nhạc là bit: nốt đặc = 1, nốt rỗng = 0.
 * Dãy bit dưới khuông là chữ "Li" ở dạng nhị phân, nên "bản nhạc" cũng là dữ liệu thật.
 */
const BITS = [..."Li"].map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0")).join("");
export const BIT_COUNT = BITS.length;
const NOTE_Y = [57, 52, 47, 42, 37, 32];

export function HeroScore({ className, active = -1 }: Props & { active?: number }) {
  return (
    <svg className={className} viewBox="0 0 1000 100" aria-hidden="true">
      <g {...base} strokeWidth={1}>
        {[22, 32, 42, 52, 62].map((y) => (
          <path key={y} d={`M4 ${y}H976`} opacity=".45" />
        ))}
        <path d="M968 22v40M976 22v40" opacity=".7" />
        <g transform="translate(14 -2) scale(.9)" strokeWidth={1.5}>
          <path d="M22 6C14 14 14 28 22 40c6 9 8 24 0 34-6 8-17 4-15-6 2-9 15-8 16 2 1 8-6 10-9 7" />
          <path d="M22 6c6 8 2 14-4 20M21 28v62" />
          <ellipse cx="17" cy="90" rx="5" ry="3.6" transform="rotate(-20 17 90)" />
        </g>
      </g>
      {BITS.split("").map((bit, i) => {
        const x = 104 + i * 54;
        const y = NOTE_Y[(i * 5 + (i % 3)) % NOTE_Y.length];
        const up = y >= 42;
        return (
          <g key={i} className={`score-note${i === active ? " on" : ""}`} style={{ animationDelay: `${0.5 + i * 0.07}s` }}>
            <g {...base} strokeWidth={1.4}>
              <path d={up ? `M${x + 6} ${y - 1}V${y - 30}` : `M${x - 6} ${y + 1}V${y + 30}`} />
              <ellipse
                cx={x}
                cy={y}
                rx={6.6}
                ry={4.6}
                transform={`rotate(-20 ${x} ${y})`}
                fill={bit === "1" ? "currentColor" : "var(--bg)"}
              />
            </g>
            <text className="score-bit" x={x} y={92} textAnchor="middle">{bit}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function TrebleClef({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 40 100" aria-hidden="true">
      <g {...base} strokeWidth={1.4}>
        <path d="M22 6C14 14 14 28 22 40c6 9 8 24 0 34-6 8-17 4-15-6 2-9 15-8 16 2 1 8-6 10-9 7" />
        <path d="M22 6c6 8 2 14-4 20" />
        <path d="M21 28v62" />
        <ellipse cx="17" cy="90" rx="5" ry="3.6" transform="rotate(-20 17 90)" />
      </g>
    </svg>
  );
}
