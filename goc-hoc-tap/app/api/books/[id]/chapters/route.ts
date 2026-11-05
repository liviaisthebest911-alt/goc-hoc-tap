import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { misconfigured, notFound, unauthorized } from "@/lib/admin-api";
import { isAdmin } from "@/lib/auth";
import { isUuid, parseChapterInput } from "@/lib/book-input";
import { createAdminClient } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id: bookId } = await params;
  if (!isUuid(bookId)) return notFound("truyện");
  const input = parseChapterInput(await req.json().catch(() => null));
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const book = await supabase.from("books").select("id").eq("id", bookId).maybeSingle();
  if (book.error) {
    console.error("create chapter: load book failed", { bookId, error: book.error });
    return NextResponse.json({ error: "Không lưu được chương" }, { status: 500 });
  }
  if (!book.data) return notFound("truyện");

  // Chương mới nằm cuối. Hai lần thêm đồng thời có thể trùng số, thứ tự hiển thị vẫn ổn định.
  const last = await supabase
    .from("book_chapters")
    .select("position")
    .eq("book_id", bookId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last.error) {
    console.error("create chapter: load position failed", { bookId, error: last.error });
    return NextResponse.json({ error: "Không lưu được chương" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("book_chapters")
    .insert({ ...input.value, book_id: bookId, position: (last.data?.position ?? 0) + 1 })
    .select("id")
    .single();
  if (error) {
    console.error("create chapter failed", { bookId, error });
    return NextResponse.json({ error: "Không lưu được chương" }, { status: 500 });
  }

  console.info("admin created chapter", { bookId, id: data.id });
  revalidatePath("/", "layout");
  return NextResponse.json({ id: data.id }, { status: 201 });
}
