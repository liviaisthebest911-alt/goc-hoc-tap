const TIME_ZONE = "Asia/Ho_Chi_Minh";

export function readMinutes(body: string) {
  const words = body.replace(/```[\s\S]*?```/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function excerpt(body: string, n = 150) {
  const text = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/^\s*[-+]\s+/gm, "")
    .replace(/[#>*`$]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > n ? text.slice(0, n) + "…" : text;
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { timeZone: TIME_ZONE });
}

/** Ngày theo giờ Việt Nam ở dạng yyyy-mm-dd, dùng cho ô chọn ngày. */
export function toDateInput(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

export function topicHref(tag: string) {
  return `/topics/${encodeURIComponent(tag)}`;
}
