import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-admin";

const BUCKET = "post-images";
const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu file ảnh" }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Chỉ hỗ trợ ảnh PNG, JPG, GIF, WebP" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ảnh quá lớn (tối đa 5MB)" }, { status: 413 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Cấu hình Supabase chưa đầy đủ" }, { status: 500 });
  }

  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const upload = () =>
    supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });

  let { error } = await upload();
  if (error && /not found/i.test(error.message)) {
    // Tạo bucket công khai ở lần upload đầu tiên.
    await supabase.storage.createBucket(BUCKET, { public: true });
    ({ error } = await upload());
  }
  if (error) {
    console.error("upload image failed", error);
    return NextResponse.json({ error: "Không tải được ảnh lên" }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
