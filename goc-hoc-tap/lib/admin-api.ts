import "server-only";
import { NextResponse } from "next/server";

export const unauthorized = () =>
  NextResponse.json({ error: "Phiên đăng nhập đã hết hạn" }, { status: 401 });
export const misconfigured = () =>
  NextResponse.json({ error: "Cấu hình Supabase chưa đầy đủ" }, { status: 500 });
export const notFound = (what: string) =>
  NextResponse.json({ error: `Không tìm thấy ${what}` }, { status: 404 });
