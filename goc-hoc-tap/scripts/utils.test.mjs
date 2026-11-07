import assert from "node:assert/strict";
import test from "node:test";
import { dayNumber, excerpt, firstImage, fold, keywords, queryWords } from "../lib/utils.ts";
import { SCALE, pitchOf } from "../lib/synth.ts";

const body = "![](https://x.co/a.png)# Tiêu đề\n\n**Lời dẫn**\n\n## Mục lục\n1. Một\n2. Hai\n\n---\n\nĐoạn đầu tiên.";

test("excerpt bỏ khung bài, chỉ giữ lời dẫn thật", () => {
  assert.equal(excerpt(body), "Đoạn đầu tiên.");
});

test("firstImage lấy ảnh đầu tiên hoặc null", () => {
  assert.equal(firstImage(body), "https://x.co/a.png");
  assert.equal(firstImage("không có ảnh"), null);
});

test("fold bỏ dấu tiếng Việt, kể cả đ", () => {
  assert.equal(fold("Đồ thị Cây"), "do thi cay");
});

test("keywords không dấu, không trùng, bỏ URL, có giới hạn", () => {
  assert.equal(keywords("Cây cây nhị phân https://x.co/abc"), "cay nhi phan");
  assert.equal(keywords("abcdef ghijkl", 5).length, 5);
  assert.ok(keywords("Học C++ và C#").split(" ").includes("c++"));
  assert.ok(keywords("Học C++ và C#").split(" ").includes("c#"));
});

test("queryWords tách như keywords, không làm rỗng câu toàn ký hiệu", () => {
  assert.deepEqual(queryWords(" Node.js "), ["node", "js"]);
  assert.deepEqual(queryWords("hash-map"), ["hash", "map"]);
  assert.deepEqual(queryWords("C++"), ["c++"]);
  assert.deepEqual(queryWords("c#"), ["c#"]);
  assert.deepEqual(queryWords("(C++),"), ["c++"]);
  assert.deepEqual(queryWords("C#."), ["c#"]);
  assert.deepEqual(queryWords("objective-c++"), ["objective", "c++"]);
  assert.deepEqual(queryWords("c++11"), ["c++", "11"]);
  assert.deepEqual(queryWords("++"), ["++"]);
  assert.deepEqual(queryWords("c"), ["c"]);
  assert.deepEqual(queryWords("   "), []);
});

test("pitchOf ổn định, nằm trong thang âm và thật sự thay đổi theo nội dung", () => {
  assert.equal(pitchOf("abc"), pitchOf("abc"));
  const pitches = new Set(Array.from({ length: 40 }, (_, i) => pitchOf(`bài ${i}`)));
  assert.ok(pitches.size >= 4);
  assert.ok([...pitches].every((p) => p >= 0 && p < SCALE.length));
});

test("dayNumber đổi ngày theo giờ Việt Nam", () => {
  const before = dayNumber(new Date("2026-01-01T10:00:00Z"));
  assert.equal(dayNumber(new Date("2026-01-01T23:30:00Z")) - before, 1); // đã là ngày 2 ở VN
});
