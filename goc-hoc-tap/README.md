# Góc học tập của OJM

Blog cá nhân xây bằng Next.js và Supabase. Admin đăng, sửa và xóa bài viết Markdown ngay trên trang web.

## Cài đặt

1. Tạo project Supabase, rồi chạy `supabase/schema.sql` trong SQL Editor. File này tạo các bảng `posts`, `books`, `book_chapters` (nếu chưa có), bật Row Level Security và chỉ cấp quyền đọc cho khóa anon. Bucket ảnh `post-images` được tạo ở lần tải ảnh đầu tiên.
2. Sao chép `.env.example` thành `.env.local` và điền giá trị.
3. Chạy ứng dụng:

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Đăng nhập tại `/admin` để quản lý bài viết và truyện.

## Nội dung quản lý bằng file

Kệ sách đọc, khoảnh khắc tự ghi, dòng "Đang học" và câu trích mỗi ngày nằm trong `data/shelf.ts`, `data/moments.ts`, `data/quotes.ts`. Sửa file rồi deploy.

Nháp của bài viết và chương truyện chỉ lưu trên trình duyệt đang dùng. Nháp được xóa sau khi lưu thành công, và mọi nháp được xóa sau khi đăng xuất thành công. Nút Back không có cảnh báo, và hai tab cùng soạn một nội dung sẽ ghi đè nháp của nhau.

## Kiểm thử

```bash
npm test
```

## Triển khai lên Vercel

- Đặt **Root Directory** là `goc-hoc-tap`, vì mã nguồn nằm trong thư mục con này.
- Khai báo tất cả biến trong `.env.example` ở mục Environment Variables.

## Bảo mật

- Phiên Admin là cookie httpOnly có ký HMAC, hết hạn sau 12 giờ.
- Đăng xuất chỉ xóa cookie trên trình duyệt đó. Để thu hồi mọi phiên, hãy đổi `ADMIN_PASSCODE` hoặc `ADMIN_SESSION_SECRET`.
- Giới hạn đăng nhập sai (5 lần trong 15 phút theo IP) lưu trong bộ nhớ từng instance, nên hãy dùng passcode dài và ngẫu nhiên.
