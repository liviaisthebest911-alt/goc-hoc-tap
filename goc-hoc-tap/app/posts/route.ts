import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { passcode, title, tag, body } = await req.json();

  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  }
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Thiếu tiêu đề hoặc nội dung" }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from("posts")
    .insert({ title: title.trim(), tag: tag?.trim() || null, body });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}