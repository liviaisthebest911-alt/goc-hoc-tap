import assert from "node:assert/strict";
import test from "node:test";
import {
  chapterDraftKey, clearAllDrafts, clearDraft, hasDraft, isChapterDraft, isPostDraft, postDraftKey, readDraft, writeDraft,
} from "../lib/drafts.ts";

const memory = () => {
  const map = new Map();
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: (k) => map.delete(k) };
};
const server = { title: "", tag: "", date: null, body: "" };
const typed = { title: "T", tag: "", date: null, body: "nội dung" };

test("mỗi bài và mỗi chương có khóa nháp riêng", () => {
  const keys = [postDraftKey(), postDraftKey("a"), postDraftKey("b"), chapterDraftKey("b1"), chapterDraftKey("b1", "c1"), chapterDraftKey("b2", "c1")];
  assert.equal(new Set(keys).size, keys.length);
});

test("nháp ghi rồi đọc lại đúng nội dung", () => {
  const store = memory();
  assert.equal(writeDraft(store, "k", server, typed, 123), true);
  assert.deepEqual(readDraft(store, "k", server, isPostDraft), { data: typed, savedAt: 123, stale: false });
});

test("báo stale khi bản trên máy chủ đổi sau khi nháp được lưu", () => {
  const store = memory();
  writeDraft(store, "k", server, typed);
  assert.equal(readDraft(store, "k", { ...server, body: "đã sửa nơi khác" }, isPostDraft).stale, true);
});

test("sửa tiếp một nháp cũ không xóa mất cảnh báo bản đã đổi", () => {
  const store = memory();
  writeDraft(store, "k", server, typed);
  const changed = { ...server, body: "đã sửa nơi khác" };
  assert.equal(readDraft(store, "k", changed, isPostDraft).stale, true);
  writeDraft(store, "k", changed, { ...typed, body: "gõ thêm" });
  assert.equal(readDraft(store, "k", changed, isPostDraft).stale, true);
});

test("nháp mới sau khi xóa nháp cũ lấy lại mốc của bản hiện tại", () => {
  const store = memory();
  writeDraft(store, "k", server, typed);
  clearDraft(store, "k");
  const changed = { ...server, body: "bản mới" };
  writeDraft(store, "k", changed, typed);
  assert.equal(readDraft(store, "k", changed, isPostDraft).stale, false);
});

test("hasDraft báo đúng, kể cả khi storage hỏng", () => {
  const store = memory();
  assert.equal(hasDraft(store, "k"), false);
  store.setItem("k", "x");
  assert.equal(hasDraft(store, "k"), true);
  assert.equal(hasDraft(null, "k"), false);
  assert.equal(hasDraft({ getItem() { throw new Error("blocked"); } }, "k"), false);
});

test("nháp trùng bản đã lưu thì không khôi phục", () => {
  const store = memory();
  writeDraft(store, "k", server, typed);
  assert.equal(readDraft(store, "k", typed, isPostDraft), null);
});

test("dữ liệu cũ hoặc hỏng bị bỏ qua, không làm vỡ form và không bị xóa", () => {
  const cases = ["{hỏng", "null", "5", '{"v":0,"savedAt":1,"data":{}}', '{"v":1,"savedAt":"x","data":{}}', '{"v":1,"savedAt":1,"data":{"title":1}}', '{"title":"định dạng cũ"}'];
  for (const raw of cases) {
    const store = memory();
    store.setItem("k", raw);
    assert.equal(readDraft(store, "k", server, isPostDraft), null, raw);
    assert.equal(store.getItem("k"), raw);
  }
});

test("từng điều kiện hợp lệ của nháp đều được kiểm tra", () => {
  const good = { v: 1, savedAt: 1, base: "x", data: typed };
  const store = memory();
  store.setItem("k", JSON.stringify(good));
  assert.ok(readDraft(store, "k", server, isPostDraft), "nháp đầy đủ phải đọc được");
  for (const bad of [{ ...good, v: 2 }, { ...good, savedAt: "1" }, { ...good, data: { ...typed, date: 5 } }, { ...good, data: { ...typed, body: 1 } }]) {
    store.setItem("k", JSON.stringify(bad));
    assert.equal(readDraft(store, "k", server, isPostDraft), null, JSON.stringify(bad));
  }
});

test("nháp bài không qua được kiểm tra của nháp chương", () => {
  const store = memory();
  writeDraft(store, "k", server, typed);
  assert.equal(readDraft(store, "k", { title: "", content: "" }, isChapterDraft), null);
});

test("localStorage không khả dụng: không ném lỗi, báo không ghi được", () => {
  const broken = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("quota"); },
    removeItem() { throw new Error("blocked"); },
  };
  assert.equal(readDraft(broken, "k", server, isPostDraft), null);
  assert.equal(writeDraft(broken, "k", server, typed), false);
  assert.doesNotThrow(() => clearDraft(broken, "k"));
  assert.equal(readDraft(null, "k", server, isPostDraft), null);
  assert.equal(writeDraft(null, "k", server, typed), false);
});

test("clearDraft chỉ xóa đúng khóa", () => {
  const store = memory();
  writeDraft(store, "a", server, typed);
  writeDraft(store, "b", server, typed);
  clearDraft(store, "a");
  assert.equal(readDraft(store, "a", server, isPostDraft), null);
  assert.ok(readDraft(store, "b", server, isPostDraft));
});

test("clearAllDrafts xóa mọi nháp, giữ tiến độ đọc truyện", () => {
  const data = new Map([
    [postDraftKey(), "1"],
    [postDraftKey("p"), "2"],
    [chapterDraftKey("b", "c"), "3"],
    ["ojm:read:b", "[]"],
  ]);
  const store = {
    get length() { return data.size; },
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (key) => data.delete(key),
  };
  clearAllDrafts(store);
  assert.deepEqual([...data.keys()], ["ojm:read:b"]);
  assert.doesNotThrow(() => clearAllDrafts(null));
});
