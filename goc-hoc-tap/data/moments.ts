/*
 * Khoảnh khắc Liu tự ghi, ngoài bài viết và truyện vốn được lấy tự động từ Supabase.
 * Ví dụ: { date: "2026-11-06", title: "Hoàn thành bài tập lớn", kind: "milestone" }
 */
export type ManualMoment = {
  date: string; // yyyy-mm-dd
  title: string;
  kind: "milestone" | "project" | "skill" | "memory";
  href?: string;
};

export const moments: ManualMoment[] = [];

/** Những gì đang học, hiện ở dòng "Đang học" trên trang chủ. */
export const learning: string[] = ["DSA"];
