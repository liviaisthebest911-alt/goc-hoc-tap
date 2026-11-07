import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { misconfigured, notFound, unauthorized } from "@/lib/admin-api";
import { isAdmin } from "@/lib/auth";
import { parsePostInput } from "@/lib/post-input";
import { createAdminClient } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string }> };

const INVALID_TEXT_REPRESENTATION = "22P02";

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

  if (error?.code === INVALID_TEXT_REPRESENTATION) return notFound("bài viết");
  if (error) {
    console.error("update post failed", { id, error });
    return NextResponse.json({ error: "Không lưu được bài viết" }, { status: 500 });
  }
  if (!data) return notFound("bài viết");

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

  if (error?.code === INVALID_TEXT_REPRESENTATION) return notFound("bài viết");
  if (error) {
    console.error("delete post failed", { id, error });
    return NextResponse.json({ error: "Không xóa được bài viết" }, { status: 500 });
  }
  if (!data) return notFound("bài viết");

  console.info("admin deleted post", { id });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
