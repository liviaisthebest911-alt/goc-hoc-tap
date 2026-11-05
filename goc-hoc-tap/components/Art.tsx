const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Violin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 400" aria-hidden="true">
      <g {...base} strokeWidth={1.5}>
        <path d="M150 172c-42 0-52 30-34 54-22 14-30 66-6 96 16 22 64 22 80 0 24-30 16-82-6-96 18-24 8-54-34-54z" />
        <path d="M150 184c-30 0-36 20-24 38M150 184c30 0 36 20 24 38" opacity=".5" />
        <path d="M136 172V70M164 172V70M143 172V74M157 172V74" opacity=".8" />
        <path d="M134 70h32" />
        <path d="M150 70c-14-2-16-30-4-34 10-3 14 8 6 12-5 3-9-2-5-6" />
        <path d="M136 42h-10M136 52h-10M164 42h10M164 52h10" />
        <path d="M126 238c-8 8-8 22 0 34M174 238c8 8 8 22 0 34" />
        <path d="M134 292h32M138 292l-3-10h30l-3 10" opacity=".8" />
        <path d="M30 340C90 250 190 150 276 82" />
        <path d="M34 346C96 256 196 156 280 88" opacity=".5" />
        <path d="M276 82l8-6M280 88l6-4" />
      </g>
    </svg>
  );
}

export function TrebleClef({ className }: { className?: string }) {
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
