import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { misconfigured, notFound, unauthorized } from "@/lib/admin-api";
import { isAdmin } from "@/lib/auth";
import { isUuid, parseChapterOrder } from "@/lib/book-input";
import { createAdminClient } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string }> };

/**
 * Nhận danh sách id chương theo thứ tự mới và đánh lại position 1..n.
 * Không có giao dịch: nếu một lệnh lỗi giữa chừng, dừng ngay và báo lỗi (không báo thành công)
 * để client tải lại thứ tự thật. Hiển thị luôn sắp theo position, created_at, id nên vẫn ổn định.
 */
export async function POST(req: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id: bookId } = await params;
  if (!isUuid(bookId)) return notFound("truyện");
  const order = parseChapterOrder(await req.json().catch(() => null));
  if ("error" in order) return NextResponse.json({ error: order.error }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const current = await supabase
    .from("book_chapters")
    .select("id, position")
    .eq("book_id", bookId);
  if (current.error) {
    console.error("reorder: load chapters failed", { bookId, error: current.error });
    return NextResponse.json({ error: "Không đổi được thứ tự chương" }, { status: 500 });
  }

  const positions = new Map(current.data.map((c) => [c.id, c.position]));
  const wanted = order.value;
  if (positions.size !== wanted.length || !wanted.every((id) => positions.has(id))) {
    return NextResponse.json(
      { error: "Danh sách chương đã thay đổi, hãy tải lại trang" },
      { status: 409 },
    );
  }

  for (const [index, id] of wanted.entries()) {
    const position = index + 1;
    if (positions.get(id) === position) continue;

    const { data, error } = await supabase
      .from("book_chapters")
      .update({ position })
      .eq("id", id)
      .eq("book_id", bookId)
      .select("id")
      .maybeSingle();
    if (error || !data) {
      console.error("reorder: update failed", { bookId, chapterId: id, position, error });
      revalidatePath("/", "layout");
      return NextResponse.json(
        { error: "Đổi thứ tự chưa hoàn tất. Danh sách đã được tải lại, hãy kiểm tra rồi thử lại" },
        { status: 500 },
      );
    }
  }

  console.info("admin reordered chapters", { bookId, count: wanted.length });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
