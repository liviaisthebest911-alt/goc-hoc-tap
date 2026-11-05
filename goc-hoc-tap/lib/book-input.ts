export type Book = {
  id: string;
  title: string;
  published: boolean;
  created_at: string;
};

export type Chapter = {
  id: string;
  book_id: string;
  title: string;
  content: string;
  position: number;
  created_at: string;
};

export type BookInput = { title: string; published: boolean };
export type ChapterInput = { title: string; content: string };

const MAX_TITLE = 200;
const MAX_CONTENT = 200_000;
const MAX_CHAPTERS = 1000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Kiểm tra trước khi hỏi DB để id sai định dạng trả về "không tìm thấy" thay vì lỗi 500. */
export function isUuid(value: string) {
  return UUID.test(value);
}

function parseTitle(title: unknown): { value: string } | { error: string } {
  if (typeof title !== "string" || !title.trim()) return { error: "Thiếu tiêu đề" };
  if (title.trim().length > MAX_TITLE) return { error: `Tiêu đề tối đa ${MAX_TITLE} ký tự` };
  return { value: title.trim() };
}

export function parseBookInput(raw: unknown): { value: BookInput } | { error: string } {
  if (typeof raw !== "object" || raw === null) return { error: "Dữ liệu không hợp lệ" };
  const { title, published } = raw as Record<string, unknown>;

  const parsed = parseTitle(title);
  if ("error" in parsed) return parsed;
  if (typeof published !== "boolean") return { error: "Trạng thái xuất bản không hợp lệ" };
  return { value: { title: parsed.value, published } };
}

export function parseChapterInput(raw: unknown): { value: ChapterInput } | { error: string } {
  if (typeof raw !== "object" || raw === null) return { error: "Dữ liệu không hợp lệ" };
  const { title, content } = raw as Record<string, unknown>;

  const parsed = parseTitle(title);
  if ("error" in parsed) return parsed;
  if (typeof content !== "string") return { error: "Nội dung không hợp lệ" };
  if (content.length > MAX_CONTENT) return { error: `Nội dung tối đa ${MAX_CONTENT} ký tự` };
  return { value: { title: parsed.value, content } };
}

/** Danh sách id chương theo thứ tự mới: toàn uuid, không trùng. */
export function parseChapterOrder(raw: unknown): { value: string[] } | { error: string } {
  const ids = typeof raw === "object" && raw !== null ? (raw as { ids?: unknown }).ids : null;
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_CHAPTERS) {
    return { error: "Danh sách chương không hợp lệ" };
  }
  if (!ids.every((id) => typeof id === "string" && isUuid(id)) || new Set(ids).size !== ids.length) {
    return { error: "Danh sách chương không hợp lệ" };
  }
  return { value: ids as string[] };
}
