import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { parsePostInput } from "@/lib/post-input";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn" }, { status: 401 });
  }

  const input = parsePostInput(await req.json().catch(() => null));
  if ("error" in input) return NextResponse.json({ error: input.error }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Cấu hình Supabase chưa đầy đủ" }, { status: 500 });
  }

  const { data, error } = await supabase.from("posts").insert(input.value).select("id").single();
  if (error) {
    console.error("create post failed", error);
    return NextResponse.json({ error: "Không lưu được bài viết" }, { status: 500 });
  }

  console.info("admin created post", { id: data.id });
  revalidatePath("/", "layout");
  return NextResponse.json({ id: data.id }, { status: 201 });
}
