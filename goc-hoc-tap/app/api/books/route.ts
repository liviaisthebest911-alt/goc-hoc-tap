import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { misconfigured, unauthorized } from "@/lib/admin-api";
import { isAdmin } from "@/lib/auth";
import { parseBookInput } from "@/lib/book-input";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const input = parseBookInput(await req.json().catch(() => null));
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return misconfigured();

  const { data, error } = await supabase.from("books").insert(input.value).select("id").single();
  if (error) {
    console.error("create book failed", error);
    return NextResponse.json({ error: "Không lưu được truyện" }, { status: 500 });
  }

  console.info("admin created book", { id: data.id });
  revalidatePath("/", "layout");
  return NextResponse.json({ id: data.id }, { status: 201 });
}
