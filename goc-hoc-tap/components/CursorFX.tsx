"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/*
 * Hiệu ứng con trỏ: đèn bàn (spotlight), lớp mực ẩn hiện dưới đèn, hạt nhạc/bit và parallax.
 * - Chỉ chạy với chuột thật và khi người dùng không tắt chuyển động.
 * - Không dùng state cho vị trí chuột: một vòng requestAnimationFrame ghi thẳng vào style
 *   và tự dừng khi không còn gì để vẽ.
 */

const FINE = "(hover: hover) and (pointer: fine)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const queries = [matchMedia(FINE), matchMedia(REDUCED)];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}
const getSnapshot = () => matchMedia(FINE).matches && !matchMedia(REDUCED).matches;
const getServerSnapshot = () => false;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  rot: number;
  vr: number;
  phase: number;
  kind: "note" | "bit" | "dot";
  color: string;
  ch: string;
};

const COLORS = ["#6F1F30", "#6F1F30", "#7C8C6E", "#B8903A"];
const MAX_PARTICLES = 64;
const SPAWN_EVERY = 30; // px di chuyển giữa hai lần sinh hạt

function drawNote(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.55, s * 0.4, -0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(s * 0.5, -s * 0.12);
  ctx.lineTo(s * 0.5, -s * 1.9);
  ctx.quadraticCurveTo(s * 1.3, -s * 1.5, s * 0.95, -s * 0.8);
  ctx.lineWidth = Math.max(1, s * 0.13);
  ctx.lineCap = "round";
  ctx.stroke();
}

export default function CursorFX() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const depthEls = useRef<HTMLElement[]>([]);

  // Tìm lại các phần tử parallax mỗi khi đổi trang.
  useEffect(() => {
    depthEls.current = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]"));
  }, [pathname]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!enabled || !root || !canvas || !ctx) return;

    const monoFamily =
      getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "monospace";
    const target = { x: innerWidth * 0.62, y: innerHeight * 0.38 };
    const pos = { ...target };
    const par = { x: 0, y: 0 };
    const particles: Particle[] = [];
    let dpr = 1;
    let running = false;
    let last = 0;
    let travelled = 0;
    let prev: { x: number; y: number } | null = null;
    let sizeFrame = 0;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (x: number, y: number, speed: number) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      const roll = Math.random();
      particles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 26 + Math.min(speed, 40) * (Math.random() - 0.5),
        vy: -(14 + Math.random() * 30),
        age: 0,
        life: 1.2 + Math.random() * 1.1,
        size: roll < 0.4 ? 7 + Math.random() * 4 : roll < 0.8 ? 12 + Math.random() * 5 : 2 + Math.random() * 2,
        rot: (Math.random() - 0.5) * 0.8,
        vr: (Math.random() - 0.5) * 0.9,
        phase: Math.random() * Math.PI * 2,
        kind: roll < 0.4 ? "note" : roll < 0.8 ? "bit" : "dot",
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        ch: Math.random() < 0.5 ? "0" : "1",
      });
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
      last = now;

      // Đèn đi theo chuột với độ trễ nhỏ để cảm giác mềm.
      const k = 1 - Math.exp(-dt * 14);
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      root.style.setProperty("--mx", `${pos.x.toFixed(1)}px`);
      root.style.setProperty("--my", `${pos.y.toFixed(1)}px`);

      // Parallax: dịch chuyển nhẹ, chỉ dùng transform.
      const kp = 1 - Math.exp(-dt * 4);
      const nx = (target.x / innerWidth - 0.5) * 2;
      const ny = (target.y / innerHeight - 0.5) * 2;
      par.x += (nx - par.x) * kp;
      par.y += (ny - par.y) * kp;
      for (const el of depthEls.current) {
        const d = Number(el.dataset.depth) || 0;
        el.style.transform = `translate3d(${(-par.x * d).toFixed(2)}px, ${(-par.y * d).toFixed(2)}px, 0)`;
      }

      // Hạt.
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.age / p.life;
        p.x += (p.vx + Math.sin(p.age * 3 + p.phase) * 10) * dt;
        p.y += p.vy * dt;
        p.vy *= 1 - dt * 0.5;
        p.rot += p.vr * dt;
        const alpha = Math.min(1, t * 8) * Math.pow(1 - t, 1.3) * 0.85;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        if (p.kind === "note") {
          drawNote(ctx, p.size);
        } else if (p.kind === "bit") {
          ctx.font = `${p.size}px ${monoFamily}, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.ch, 0, 0);
        } else {
          ctx.globalAlpha = alpha * 0.35;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      const settled =
        Math.abs(target.x - pos.x) < 0.3 &&
        Math.abs(target.y - pos.y) < 0.3 &&
        Math.abs(nx - par.x) < 0.002 &&
        Math.abs(ny - par.y) < 0.002;
      if (settled && particles.length === 0) {
        running = false;
        return;
      }
      requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.x = e.clientX;
      target.y = e.clientY;
      root.dataset.on = "1";
      if (prev) {
        const d = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
        travelled += d;
        if (travelled >= SPAWN_EVERY) {
          spawn(e.clientX, e.clientY, d);
          if (d > 40) spawn(e.clientX, e.clientY, d);
          travelled = 0;
        }
      }
      prev = { x: e.clientX, y: e.clientY };
      start();
    };
    const onLeave = () => {
      root.dataset.on = "0";
      prev = null;
    };
    const onResize = () => {
      cancelAnimationFrame(sizeFrame);
      sizeFrame = requestAnimationFrame(resize);
    };

    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    addEventListener("resize", onResize);
    start();

    return () => {
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(sizeFrame);
      running = true; // chặn start() sau khi dọn dẹp
      depthEls.current.forEach((el) => (el.style.transform = ""));
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="fx" data-on="0" aria-hidden="true">
      <div className="fx-ink" />
      <div className="fx-lamp" />
      <canvas ref={canvasRef} className="fx-trail" />
    </div>
  );
}
