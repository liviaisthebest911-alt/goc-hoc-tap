-- Chạy trong Supabase SQL Editor. An toàn khi chạy lại nhiều lần.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_tag_idx on public.posts (tag);

-- Khóa anon chỉ được đọc. Khóa này công khai trên trình duyệt, nên nếu không bật
-- RLS thì ai cũng có thể sửa hoặc xóa bài trực tiếp qua API của Supabase.
-- Service role bỏ qua RLS, nên các thao tác của Admin qua app vẫn hoạt động.
alter table public.posts enable row level security;

drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts
  for select to anon, authenticated
  using (true);
