export type PostInput = {
  title: string;
  tag: string | null;
  body: string;
  created_at?: string;
};

const MAX_TITLE = 200;
const MAX_TAG = 50;
const MAX_BODY = 200_000;

function publishedAt(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T12:00:00+07:00`);
  // Date tự chuyển 2026-02-31 thành tháng 3, nên phải so lại với chuỗi gốc.
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10) === date ? parsed.toISOString() : null;
}

/** Kiểm tra dữ liệu từ client. `date` chỉ có khi Admin đổi ngày đăng. */
export function parsePostInput(raw: unknown): { value: PostInput } | { error: string } {
  if (typeof raw !== "object" || raw === null) return { error: "Dữ liệu không hợp lệ" };
  const { title, tag, body, date } = raw as Record<string, unknown>;

  if (typeof title !== "string" || typeof body !== "string" || !title.trim() || !body.trim()) {
    return { error: "Thiếu tiêu đề hoặc nội dung" };
  }
  if (tag !== undefined && tag !== null && typeof tag !== "string") {
    return { error: "Chủ đề không hợp lệ" };
  }
  if (title.trim().length > MAX_TITLE) return { error: `Tiêu đề tối đa ${MAX_TITLE} ký tự` };
  if ((tag ?? "").trim().length > MAX_TAG) return { error: `Chủ đề tối đa ${MAX_TAG} ký tự` };
  if (body.length > MAX_BODY) return { error: `Nội dung tối đa ${MAX_BODY} ký tự` };

  const value: PostInput = { title: title.trim(), tag: tag?.trim() || null, body };

  if (date !== undefined) {
    const createdAt = typeof date === "string" ? publishedAt(date) : null;
    if (!createdAt) return { error: "Ngày đăng không hợp lệ" };
    value.created_at = createdAt;
  }
  return { value };
}
