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
    // Bỏ tiêu đề, dòng đậm đứng riêng, mục lục đánh số và đường kẻ: đó là khung bài, không phải lời dẫn.
    .replace(/^#{1,6}\s.*$/gm, "")
    .replace(/^\s*\*\*[^*\n]+\*\*\s*$/gm, "")
    .replace(/^\s*\d+\.\s.*$/gm, "")
    .replace(/^\s*-{3,}\s*$/gm, "")
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

export function fmtLong(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Ảnh đầu tiên trong Markdown, dùng làm bìa bài viết. */
export function firstImage(body: string) {
  return body.match(/!\[[^\]]*\]\((https?:[^)\s]+)/)?.[1] ?? null;
}

/** Bỏ dấu tiếng Việt để tìm "cay" vẫn ra "cây". */
export function fold(text: string) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/gi, "d").toLowerCase();
}

const WORD = /[\p{L}\p{N}]+[+#]+|[\p{L}\p{N}]{2,}/gu;

/**
 * Danh sách từ không dấu, không trùng, theo thứ tự xuất hiện, dùng cho ô tìm kiếm.
 * shortcut: chỉ giữ tới maxChars ký tự nên từ ở cuối bài rất dài có thể không tìm thấy, nâng lên chỉ mục phía máy chủ khi cần.
 */
export function keywords(body: string, maxChars = 6000) {
  const words = fold(body.replace(/https?:\S+/g, " ")).match(WORD) ?? [];
  return [...new Set(words)].join(" ").slice(0, maxChars);
}

/** Tách câu tìm kiếm như keywords(); "C++" giữ nguyên, nếu không sẽ khớp mọi chữ c. */
export function queryWords(query: string) {
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((chunk) => chunk.match(WORD) ?? [chunk]);
}

/** Ngày theo giờ Việt Nam ở dạng yyyy-mm-dd, dùng cho ô chọn ngày. */
export function toDateInput(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

export function topicHref(tag: string) {
  return `/topics/${encodeURIComponent(tag)}`;
}

/** Số thứ tự của ngày hôm nay theo giờ Việt Nam, đổi lúc nửa đêm. */
export function dayNumber(now = new Date()) {
  return Math.floor(Date.parse(toDateInput(now.toISOString())) / 86_400_000);
}
