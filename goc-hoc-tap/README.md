# Góc học tập của OJM

Blog cá nhân xây bằng Next.js và Supabase. Admin đăng, sửa và xóa bài viết Markdown ngay trên trang web.

## Cài đặt

1. Tạo project Supabase, rồi chạy `supabase/schema.sql` trong SQL Editor. File này tạo bảng `posts` (nếu chưa có) và bật Row Level Security để khóa anon chỉ đọc được.
2. Sao chép `.env.example` thành `.env.local` và điền giá trị.
3. Chạy ứng dụng:

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Đăng nhập tại `/admin` để quản lý bài viết.

## Triển khai lên Vercel

- Đặt **Root Directory** là `goc-hoc-tap`, vì mã nguồn nằm trong thư mục con này.
- Khai báo tất cả biến trong `.env.example` ở mục Environment Variables.

## Bảo mật

- Phiên Admin là cookie httpOnly có ký HMAC, hết hạn sau 12 giờ.
- Đăng xuất chỉ xóa cookie trên trình duyệt đó. Để thu hồi mọi phiên, hãy đổi `ADMIN_PASSCODE` hoặc `ADMIN_SESSION_SECRET`.
- Giới hạn đăng nhập sai (5 lần trong 15 phút theo IP) lưu trong bộ nhớ từng instance, nên hãy dùng passcode dài và ngẫu nhiên.
