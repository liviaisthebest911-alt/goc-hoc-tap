import assert from "node:assert/strict";
import test from "node:test";
import { isUuid, parseBookInput, parseChapterInput, parseChapterOrder } from "../lib/book-input.ts";
import { MAX_IMAGE_BYTES, parsePostInput } from "../lib/post-input.ts";

const id = "4424233e-4f79-452f-a433-16733a0ddaa6";

test("parsePostInput nhận bài hợp lệ và chuẩn hóa", () => {
  const { value } = parsePostInput({ title: "  A ", tag: "  ", body: "b" });
  assert.deepEqual(value, { title: "A", tag: null, body: "b" });
});

test("parsePostInput từ chối dữ liệu sai", () => {
  for (const raw of [null, "x", {}, { title: " ", body: "b" }, { title: "a", body: " " }, { title: 1, body: "b" }, { title: "a", body: "b", tag: 5 }]) {
    assert.ok("error" in parsePostInput(raw));
  }
  assert.ok("error" in parsePostInput({ title: "a".repeat(201), body: "b" }));
  assert.ok("error" in parsePostInput({ title: "a", tag: "t".repeat(51), body: "b" }));
  assert.ok("error" in parsePostInput({ title: "a", body: "b".repeat(200_001) }));
});

test("parsePostInput kiểm tra ngày đăng thật", () => {
  assert.ok(parsePostInput({ title: "a", body: "b", date: "2026-02-10" }).value.created_at.startsWith("2026-02-10"));
  for (const date of ["2026-02-31", "2026-13-01", "hôm nay", 5]) {
    assert.ok("error" in parsePostInput({ title: "a", body: "b", date }));
  }
});

test("giới hạn ảnh thấp hơn giới hạn thân request của Vercel", () => {
  assert.ok(MAX_IMAGE_BYTES < 4.5 * 1024 * 1024);
  assert.ok(MAX_IMAGE_BYTES >= 1024 * 1024, "vẫn đủ cho ảnh chụp màn hình thông thường");
});

test("parseBookInput và parseChapterInput", () => {
  assert.deepEqual(parseBookInput({ title: " T ", published: true }).value, { title: "T", published: true });
  assert.ok("error" in parseBookInput({ title: "T", published: "có" }));
  assert.ok("error" in parseChapterInput({ title: "T", content: 1 }));
  assert.ok("error" in parseChapterInput({ title: "T", content: "x".repeat(200_001) }));
});

test("parseChapterOrder chỉ nhận uuid không trùng", () => {
  assert.deepEqual(parseChapterOrder({ ids: [id] }).value, [id]);
  for (const raw of [null, {}, { ids: [] }, { ids: ["x"] }, { ids: [id, id] }]) {
    assert.ok("error" in parseChapterOrder(raw));
  }
  assert.ok(isUuid(id) && !isUuid("x"));
});
