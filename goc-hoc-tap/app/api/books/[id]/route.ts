import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { misconfigured, notFound, unauthorized } from "@/lib/admin-api";
import { isAdmin } from "@/lib/auth";
import { isUuid, parseBookInput } from "@/lib/book-input";
import { createAdminClient } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  if (!isUuid(id)) return notFound("truyện");
  const input = parseBookInput(await req.json().catch(() => null));
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const { data, error } = await supabase
    .from("books")
    .update(input.value)
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("update book failed", { id, error });
    return NextResponse.json({ error: "Không lưu được truyện" }, { status: 500 });
  }
  if (!data) return notFound("truyện");

  console.info("admin updated book", { id });
  revalidatePath("/", "layout");
  return NextResponse.json({ id: data.id });
}

/** Xóa truyện kéo theo xóa các chương (ON DELETE CASCADE). */
export async function DELETE(_req: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  if (!isUuid(id)) return notFound("truyện");
  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const { data, error } = await supabase
    .from("books")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("delete book failed", { id, error });
    return NextResponse.json({ error: "Không xóa được truyện" }, { status: 500 });
  }
  if (!data) return notFound("truyện");

  console.info("admin deleted book", { id });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
