"use client";

import type { Draft } from "@/lib/drafts";

const when = (at: number) =>
  new Date(at).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "numeric" });

type Props = {
  restored: Draft<unknown> | null;
  saved: { ok: boolean; at: number } | null;
  dirty: boolean;
  otherTab: boolean;
  /** Có bản đã lưu trên máy chủ hay đây là nội dung mới hoàn toàn. */
  existing: boolean;
  onDiscard: () => void;
};

export default function DraftNotice({ restored, saved, dirty, otherTab, existing, onDiscard }: Props) {
  const question = existing ? "Bỏ nháp này và dùng bản đã lưu?" : "Bỏ nháp này? Nội dung trong nháp sẽ mất.";

  return (
    <>
      {restored && (
        <div className="draft-note" role="status">
          <p>
            Đã khôi phục nháp lưu lúc {when(restored.savedAt)}.
            {restored.stale && " Bản trên máy chủ đã thay đổi sau đó, hãy kiểm tra trước khi lưu."}
          </p>
          <button
            type="button"
            className="link danger"
            onClick={() => window.confirm(question) && onDiscard()}
          >
            Bỏ nháp
          </button>
        </div>
      )}
      {otherTab && (
        <p className="error" role="alert">Nội dung này cũng đang được soạn ở một tab khác, nháp của hai tab sẽ ghi đè nhau.</p>
      )}
      {saved?.ok === false ? (
        <p className="error" role="alert">Trình duyệt không lưu được nháp. Hãy bấm lưu sớm để tránh mất nội dung.</p>
      ) : (
        <p className="muted draft-state" role="status">
          {saved && dirty
            ? `Đã lưu nháp lúc ${when(saved.at)}, chưa đăng.`
            : dirty && !restored
              ? "Có thay đổi chưa lưu."
              : ""}
        </p>
      )}
    </>
  );
}
