import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { misconfigured, notFound, unauthorized } from "@/lib/admin-api";
import { isAdmin } from "@/lib/auth";
import { isUuid, parseChapterInput } from "@/lib/book-input";
import { createAdminClient } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string; chapterId: string }> };

// Mọi truy vấn lọc cả id chương lẫn book_id: chương chỉ bị tác động qua đúng truyện của nó.

export async function PATCH(req: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id: bookId, chapterId } = await params;
  if (!isUuid(bookId) || !isUuid(chapterId)) return notFound("chương");
  const input = parseChapterInput(await req.json().catch(() => null));
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const { data, error } = await supabase
    .from("book_chapters")
    .update(input.value)
    .eq("id", chapterId)
    .eq("book_id", bookId)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("update chapter failed", { bookId, chapterId, error });
    return NextResponse.json({ error: "Không lưu được chương" }, { status: 500 });
  }
  if (!data) return notFound("chương");

  console.info("admin updated chapter", { bookId, chapterId });
  revalidatePath("/", "layout");
  return NextResponse.json({ id: data.id });
}

export async function DELETE(_req: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id: bookId, chapterId } = await params;
  if (!isUuid(bookId) || !isUuid(chapterId)) return notFound("chương");
  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const { data, error } = await supabase
    .from("book_chapters")
    .delete()
    .eq("id", chapterId)
    .eq("book_id", bookId)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("delete chapter failed", { bookId, chapterId, error });
    return NextResponse.json({ error: "Không xóa được chương" }, { status: 500 });
  }
  if (!data) return notFound("chương");

  console.info("admin deleted chapter", { bookId, chapterId });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
