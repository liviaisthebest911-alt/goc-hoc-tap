"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { browserStore, clearDraft, hasDraft, readDraft, writeDraft, type Draft } from "@/lib/drafts";

const DELAY_MS = 600;
const LEAVE_KEPT = "Bạn có thay đổi chưa lưu. Nháp vẫn được giữ trên trình duyệt này. Vẫn rời trang?";
const LEAVE_LOST = "Trình duyệt không lưu được nháp, nội dung chưa lưu sẽ mất. Vẫn rời trang?";

const noSubscribe = () => () => {};

/** localStorage chỉ có sau khi lên trình duyệt, nên form soạn thảo chờ tới lúc này mới dựng. */
export function useHydrated() {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

export function useRestoredDraft<T>(key: string, server: T, isValid: (x: unknown) => x is T) {
  return useState<Draft<T> | null>(() => readDraft(browserStore(), key, server, isValid));
}

/**
 * Tự lưu nháp, cảnh báo khi rời trang lúc còn thay đổi chưa lưu.
 * shortcut: nút Back không có cảnh báo và hai tab cùng khóa ghi đè nhau (kể cả tab đang soạn ghi lại nháp sau khi tab kia đăng xuất); nháp vẫn được giữ, chỉ xử lý thêm khi Liu thật sự mất nội dung vì việc này.
 */
export function useAutosave<T>(key: string, server: T, values: T) {
  const serverJson = JSON.stringify(server);
  const json = JSON.stringify(values);
  const dirty = json !== serverJson;

  const [saved, setSaved] = useState<{ ok: boolean; at: number } | null>(null);
  const [otherTab, setOtherTab] = useState(false);
  const start = useRef(json); // chỉ ghi hoặc xóa sau khi người viết thật sự sửa gì đó
  const finished = useRef(false);
  const latest = useRef({ values, server, json, dirty });

  useEffect(() => {
    latest.current = { values, server, json, dirty };
  });

  useEffect(() => {
    if (finished.current || json === start.current) return;
    start.current = ""; // từ đây mọi giá trị đều là thay đổi của người viết
    const timer = setTimeout(() => {
      if (finished.current) return; // bài đã lưu xong trong lúc chờ, không được ghi lại nháp
      const store = browserStore();
      if (dirty) setSaved({ ok: writeDraft(store, key, server, values), at: Date.now() });
      else {
        clearDraft(store, key);
        setSaved(null);
      }
    }, DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- json đã đại diện cho values và server
  }, [key, json, serverJson, dirty]);

  useEffect(() => {
    // Ghi nốt phần còn trong thời gian chờ khi đóng tab hoặc rời khỏi form.
    const flush = () => {
      const now = latest.current;
      if (finished.current || start.current !== "" || !now.dirty) return;
      writeDraft(browserStore(), key, now.server, now.values);
    };
    addEventListener("pagehide", flush);
    return () => {
      removeEventListener("pagehide", flush);
      flush();
    };
  }, [key]);

  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      if (finished.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    // Điều hướng nội bộ của Next không kích hoạt beforeunload, nên phải chặn lúc bấm link.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || finished.current || link.target === "_blank") return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      // Thử ghi ngay để lời hứa giữ nháp luôn đúng; chưa sửa gì thì giữ nguyên nháp đã khôi phục.
      const now = latest.current;
      const store = browserStore();
      const kept = start.current === "" ? writeDraft(store, key, now.server, now.values) : hasDraft(store, key);
      if (window.confirm(kept ? LEAVE_KEPT : LEAVE_LOST)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    addEventListener("beforeunload", onUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      removeEventListener("beforeunload", onUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty, key]);

  useEffect(() => {
    // Hai tab cùng khóa sẽ ghi đè nhau; không gộp được nên báo cho người viết biết.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setOtherTab(e.newValue !== null); // tab kia đã lưu hoặc bỏ nháp thì hết xung đột
      // Tab kia vừa xóa nháp chung, nhưng chữ đang sửa ở tab này chưa được lưu ở đâu cả.
      const now = latest.current;
      if (e.newValue === null && start.current === "" && now.dirty && !finished.current) {
        writeDraft(browserStore(), key, now.server, now.values);
      }
    };
    addEventListener("storage", onStorage);
    return () => removeEventListener("storage", onStorage);
  }, [key]);

  /** Chỉ gọi sau khi máy chủ xác nhận đã lưu. */
  const finish = useCallback(() => {
    finished.current = true;
    clearDraft(browserStore(), key);
  }, [key]);

  /** Người viết chủ động bỏ nháp; form được đưa về bản đã lưu ngay sau đó. */
  const discard = useCallback(() => {
    clearDraft(browserStore(), key);
    start.current = serverJson;
    setSaved(null);
  }, [key, serverJson]);

  return { dirty, saved, otherTab, finish, discard };
}
