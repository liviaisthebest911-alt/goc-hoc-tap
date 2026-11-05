import "server-only";
import { createAdminClient } from "@/lib/supabase-admin";
import { isUuid, type Book, type Chapter } from "@/lib/book-input";

/** Đọc bằng service-role để thấy cả truyện nháp. Chỉ gọi sau requireAdmin(). */
function client() {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Cấu hình Supabase chưa đầy đủ");
  return supabase;
}

export async function listAllBooks(): Promise<(Book & { chapter_count: number })[]> {
  const { data, error } = await client()
    .from("books")
    .select("*, book_chapters(count)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Không tải được danh sách truyện: ${error.message}`);
  return data.map(({ book_chapters, ...book }) => ({
    ...book,
    chapter_count: book_chapters[0]?.count ?? 0,
  }));
}

export async function getBookAdmin(id: string): Promise<Book | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await client().from("books").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Không tải được truyện: ${error.message}`);
  return data;
}

export async function listChaptersAdmin(bookId: string): Promise<Chapter[]> {
  const { data, error } = await client()
    .from("book_chapters")
    .select("*")
    .eq("book_id", bookId)
    .order("position")
    .order("created_at")
    .order("id");
  if (error) throw new Error(`Không tải được danh sách chương: ${error.message}`);
  return data;
}

export async function getChapterAdmin(bookId: string, chapterId: string): Promise<Chapter | null> {
  if (!isUuid(bookId) || !isUuid(chapterId)) return null;
  const { data, error } = await client()
    .from("book_chapters")
    .select("*")
    .eq("id", chapterId)
    .eq("book_id", bookId)
    .maybeSingle();
  if (error) throw new Error(`Không tải được chương: ${error.message}`);
  return data;
}
