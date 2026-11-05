import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "ojm_admin_session";
/** Hạn cứng, không gia hạn theo hoạt động. */
const SESSION_SECONDS = 12 * 60 * 60;
const MIN_SECRET_LENGTH = 32;

/**
 * Trả về null nếu cấu hình thiếu, khi đó mọi đăng nhập và phiên đều bị từ chối.
 * Khóa ký gồm cả passcode nên đổi passcode sẽ làm mất hiệu lực mọi phiên cũ.
 */
function authConfig() {
  const passcode = process.env.ADMIN_PASSCODE;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!passcode || !secret || secret.length < MIN_SECRET_LENGTH) return null;
  return { passcode, signingKey: `${secret}:${passcode}` };
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

function sign(expiresAt: string, signingKey: string) {
  return createHmac("sha256", signingKey).update(`admin.${expiresAt}`).digest("base64url");
}

export function isAuthConfigured() {
  return authConfig() !== null;
}

export function verifyPasscode(input: string) {
  const config = authConfig();
  if (!config) return false;
  return timingSafeEqual(sha256(input), sha256(config.passcode));
}

export async function startAdminSession() {
  const config = authConfig();
  if (!config) throw new Error("Chưa cấu hình xác thực Admin");

  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const store = await cookies();
  store.set(SESSION_COOKIE, `${expiresAt}.${sign(expiresAt, config.signingKey)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function endAdminSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  const config = authConfig();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!config || !token) return false;

  const [expiresAt, signature, ...rest] = token.split(".");
  if (!expiresAt || !signature || rest.length > 0) return false;
  if (Number(expiresAt) * 1000 <= Date.now()) return false;

  return timingSafeEqual(sha256(signature), sha256(sign(expiresAt, config.signingKey)));
}

/** Dùng trong từng trang quản trị. API route gọi isAdmin() và trả về 401. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
