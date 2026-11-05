const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

const failures = new Map<string, { count: number; resetAt: number }>();

/**
 * Giới hạn theo IP, lưu trong bộ nhớ của từng instance. Trên serverless đây chỉ
 * là lớp cản cơ bản, nên ADMIN_PASSCODE vẫn phải dài và ngẫu nhiên.
 */
export function isLoginBlocked(ip: string) {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (entry.resetAt <= Date.now()) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordLoginFailure(ip: string) {
  const now = Date.now();
  for (const [key, entry] of failures) {
    if (entry.resetAt <= now) failures.delete(key);
  }
  const entry = failures.get(ip);
  if (entry) entry.count += 1;
  else failures.set(ip, { count: 1, resetAt: now + WINDOW_MS });
}

export function clearLoginFailures(ip: string) {
  failures.delete(ip);
}
