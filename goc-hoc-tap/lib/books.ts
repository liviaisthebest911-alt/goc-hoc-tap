import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { isUuid, type Book, type Chapter } from "@/lib/book-input";

export type { Book, Chapter };

/** Đọc công khai bằng anon key. RLS chỉ trả truyện đã xuất bản và chương của chúng. */
export async function listBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Không tải được danh sách truyện: ${error.message}`);
  return data;
}

export const getBook = cache(async (id: string): Promise<Book | null> => {
  if (!isUuid(id)) return null;
  const { data, error } = await supabase.from("books").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Không tải được truyện: ${error.message}`);
  return data;
});

/** Chương của một truyện theo thứ tự ổn định: position, created_at, id. */
export const listChapters = cache(async (bookId: string): Promise<Chapter[]> => {
  const { data, error } = await supabase
    .from("book_chapters")
    .select("*")
    .eq("book_id", bookId)
    .order("position")
    .order("created_at")
    .order("id");
  if (error) throw new Error(`Không tải được danh sách chương: ${error.message}`);
  return data;
});
