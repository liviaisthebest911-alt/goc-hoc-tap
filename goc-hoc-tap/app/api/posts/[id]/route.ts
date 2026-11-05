import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { parsePostInput } from "@/lib/post-input";
import { createAdminClient } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string }> };

const INVALID_TEXT_REPRESENTATION = "22P02";

const unauthorized = () =>
  NextResponse.json({ error: "Phiên đăng nhập đã hết hạn" }, { status: 401 });
const notFound = () => NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
const misconfigured = () =>
  NextResponse.json({ error: "Cấu hình Supabase chưa đầy đủ" }, { status: 500 });

export async function PATCH(req: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  const input = parsePostInput(await req.json().catch(() => null));
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const { data, error } = await supabase
    .from("posts")
    .update(input.value)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error?.code === INVALID_TEXT_REPRESENTATION) return notFound();
  if (error) {
    console.error("update post failed", { id, error });
    return NextResponse.json({ error: "Không lưu được bài viết" }, { status: 500 });
  }
  if (!data) return notFound();

  console.info("admin updated post", { id });
  revalidatePath("/", "layout");
  return NextResponse.json({ id: data.id });
}

export async function DELETE(_req: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error?.code === INVALID_TEXT_REPRESENTATION) return notFound();
  if (error) {
    console.error("delete post failed", { id, error });
    return NextResponse.json({ error: "Không xóa được bài viết" }, { status: 500 });
  }
  if (!data) return notFound();

  console.info("admin deleted post", { id });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
