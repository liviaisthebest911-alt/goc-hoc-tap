export function readMinutes(body: string) {
  const words = body.replace(/```[\s\S]*?```/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function excerpt(body: string, n = 150) {
  const text = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*`$\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > n ? text.slice(0, n) + "…" : text;
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}