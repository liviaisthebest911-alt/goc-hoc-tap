import { NextResponse } from "next/server";
import {
  endAdminSession,
  isAuthConfigured,
  startAdminSession,
  verifyPasscode,
} from "@/lib/auth";
import { clearLoginFailures, isLoginBlocked, recordLoginFailure } from "@/lib/login-throttle";

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    console.error("admin login rejected: auth env vars missing or too short");
    return NextResponse.json({ error: "Máy chủ chưa cấu hình xác thực" }, { status: 503 });
  }

  const ip = clientIp(req);
  if (isLoginBlocked(ip)) {
    console.warn("admin login blocked", { ip });
    return NextResponse.json({ error: "Thử sai quá nhiều lần, hãy quay lại sau" }, { status: 429 });
  }

  const payload = await req.json().catch(() => null);
  const passcode = payload?.passcode;
  if (typeof passcode !== "string" || !verifyPasscode(passcode)) {
    recordLoginFailure(ip);
    console.warn("admin login failed", { ip });
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  }

  clearLoginFailures(ip);
  await startAdminSession();
  console.info("admin login succeeded", { ip });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await endAdminSession();
  return NextResponse.json({ ok: true });
}
