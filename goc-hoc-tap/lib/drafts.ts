/*
 * Nháp soạn thảo trên trình duyệt. Chỉ dựa vào đối tượng lưu trữ truyền vào nên chạy được
 * trong test; mọi thao tác đều nuốt lỗi vì localStorage có thể bị chặn hoặc đầy.
 */
export type DraftStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type Draft<T> = { data: T; savedAt: number; stale: boolean };

export type PostDraft = { title: string; tag: string; date: string | null; body: string };
export type ChapterDraft = { title: string; content: string };

const VERSION = 1;
const DRAFT_PREFIX = "ojm:draft:";

export const postDraftKey = (id?: string) => `${DRAFT_PREFIX}post:${id ?? "new"}`;
export const chapterDraftKey = (bookId: string, id?: string) =>
  `${DRAFT_PREFIX}chapter:${bookId}:${id ?? "new"}`;

export function isPostDraft(x: unknown): x is PostDraft {
  const d = x as PostDraft | null;
  return (
    typeof d?.title === "string" &&
    typeof d.tag === "string" &&
    (d.date === null || typeof d.date === "string") &&
    typeof d.body === "string"
  );
}

export function isChapterDraft(x: unknown): x is ChapterDraft {
  const d = x as ChapterDraft | null;
  return typeof d?.title === "string" && typeof d.content === "string";
}

/** Dấu vân tay FNV-1a, chỉ để biết bản trên máy chủ có đổi sau khi nháp được lưu hay không. */
export function fingerprint(text: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

export function browserStore(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Trả về null nếu không có nháp, nháp hỏng, sai phiên bản, hoặc nháp đã trùng bản đã lưu. */
export function readDraft<T>(
  store: DraftStore | null,
  key: string,
  server: T,
  isValid: (x: unknown) => x is T,
): Draft<T> | null {
  try {
    const parsed = JSON.parse(store?.getItem(key) ?? "null");
    if (parsed?.v !== VERSION || typeof parsed.savedAt !== "number" || !isValid(parsed.data)) return null;
    const serverJson = JSON.stringify(server);
    if (JSON.stringify(parsed.data) === serverJson) return null;
    return { data: parsed.data, savedAt: parsed.savedAt, stale: parsed.base !== fingerprint(serverJson) };
  } catch {
    return null;
  }
}

function previousBase(store: DraftStore, key: string): string | null {
  try {
    const base = JSON.parse(store.getItem(key) ?? "null")?.base;
    return typeof base === "string" ? base : null;
  } catch {
    return null;
  }
}

/**
 * Trả về false khi không ghi được, để giao diện báo cho người viết biết.
 * Giữ base của nháp đang có: nháp sinh ra từ bản cũ vẫn phải bị báo là cũ sau khi sửa tiếp.
 */
export function writeDraft<T>(store: DraftStore | null, key: string, server: T, data: T, now = Date.now()) {
  if (!store) return false;
  try {
    const base = previousBase(store, key) ?? fingerprint(JSON.stringify(server));
    store.setItem(key, JSON.stringify({ v: VERSION, savedAt: now, base, data }));
    return true;
  } catch {
    return false;
  }
}

export function hasDraft(store: DraftStore | null, key: string) {
  try {
    return store?.getItem(key) != null;
  } catch {
    return false;
  }
}

export function clearDraft(store: DraftStore | null, key: string) {
  try {
    store?.removeItem(key);
  } catch {}
}

/** Xóa mọi nháp soạn thảo, không đụng tới dữ liệu khác như tiến độ đọc truyện. */
export function clearAllDrafts(store: Pick<Storage, "key" | "length" | "removeItem"> | null) {
  try {
    if (!store) return;
    const keys = Array.from({ length: store.length }, (_, i) => store.key(i));
    for (const key of keys) {
      if (key?.startsWith(DRAFT_PREFIX)) store.removeItem(key);
    }
  } catch {}
}
