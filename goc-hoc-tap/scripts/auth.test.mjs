// Test lib/auth.ts nguyên trạng: chỉ giả lập next/headers và next/navigation, không sửa code xác thực.
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

const jar = new Map();
globalThis.__jar = {
  get: (name) => (jar.has(name) ? { value: jar.get(name) } : undefined),
  set: (name, value, options) => {
    jar.set(name, value);
    globalThis.__cookieOptions = options;
  },
  delete: (name) => jar.delete(name),
};
const STUBS = {
  "server-only": "",
  "next/headers": "export const cookies = async () => globalThis.__jar;",
  "next/navigation": "export const redirect = (to) => { throw new Error('redirect:' + to); };",
};
registerHooks({
  resolve: (specifier, context, next) =>
    specifier in STUBS ? { url: `data:text/javascript,${encodeURIComponent(STUBS[specifier])}`, shortCircuit: true } : next(specifier, context),
});

process.env.ADMIN_PASSCODE = "mat-khau-chi-dung-trong-test";
process.env.ADMIN_SESSION_SECRET = "s".repeat(40);
const auth = await import("../lib/auth.ts");
const COOKIE = "ojm_admin_session";

test("passcode đúng được chấp nhận, sai bị từ chối", () => {
  assert.equal(auth.verifyPasscode("mat-khau-chi-dung-trong-test"), true);
  assert.equal(auth.verifyPasscode("sai"), false);
});

test("phiên hợp lệ sau khi đăng nhập, mất khi đăng xuất", async () => {
  jar.clear();
  assert.equal(await auth.isAdmin(), false);
  await auth.startAdminSession();
  assert.equal(await auth.isAdmin(), true);
  await auth.endAdminSession();
  assert.equal(await auth.isAdmin(), false);
});

test("cookie phiên không đọc được từ JavaScript", async () => {
  const env = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  await auth.startAdminSession();
  process.env.NODE_ENV = env;
  const { httpOnly, sameSite, path, secure, maxAge } = globalThis.__cookieOptions;
  assert.deepEqual(
    { httpOnly, sameSite, path, secure, maxAge },
    { httpOnly: true, sameSite: "lax", path: "/", secure: true, maxAge: 12 * 60 * 60 },
  );
});

test("token bị sửa hoặc sai định dạng bị từ chối", async () => {
  jar.clear();
  await auth.startAdminSession();
  const [expires, signature] = jar.get(COOKIE).split(".");
  for (const token of [`${expires}.${signature}x`, `${Number(expires) + 9999}.${signature}`, expires, `${expires}.${signature}.x`, "", "."]) {
    jar.set(COOKIE, token);
    assert.equal(await auth.isAdmin(), false, token);
  }
});

test("phiên hết hạn bị từ chối", async (t) => {
  jar.clear();
  await auth.startAdminSession();
  t.mock.timers.enable({ apis: ["Date"], now: Date.now() + 13 * 60 * 60 * 1000 });
  assert.equal(await auth.isAdmin(), false);
});

test("đổi passcode làm mất hiệu lực phiên cũ", async () => {
  jar.clear();
  await auth.startAdminSession();
  process.env.ADMIN_PASSCODE = "mat-khau-moi-chi-dung-trong-test";
  assert.equal(await auth.isAdmin(), false);
  process.env.ADMIN_PASSCODE = "mat-khau-chi-dung-trong-test";
});

test("thiếu cấu hình thì từ chối tất cả", async () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = "ngan-qua";
  assert.equal(auth.isAuthConfigured(), false);
  assert.equal(auth.verifyPasscode("mat-khau-chi-dung-trong-test"), false);
  process.env.ADMIN_SESSION_SECRET = secret;
});

test("requireAdmin chuyển hướng khi chưa đăng nhập", async () => {
  jar.clear();
  await assert.rejects(auth.requireAdmin(), /redirect:\/admin\/login/);
});
