import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? createClient(url, serviceRoleKey) : null;
}

export async function POST(req: Request) {
  const { passcode, title, tag, body } = await req.json();

  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  }
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Thiếu tiêu đề hoặc nội dung" }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Cấu hình Supabase chưa đầy đủ" }, { status: 500 });
  }

  const { error } = await supabase
    .from("posts")
    .insert({ title: title.trim(), tag: tag?.trim() || null, body });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}