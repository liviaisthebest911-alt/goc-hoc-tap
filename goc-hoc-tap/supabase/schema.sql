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

-- RLS không chặn TRUNCATE, nên anon và authenticated chỉ được cấp quyền đọc.
revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
grant select, insert, update, delete on public.posts to service_role;

-- Khóa anon chỉ được đọc. Khóa này công khai trên trình duyệt, nên nếu không bật
-- RLS thì ai cũng có thể sửa hoặc xóa bài trực tiếp qua API của Supabase.
-- Service role bỏ qua RLS, nên các thao tác của Admin qua app vẫn hoạt động.
alter table public.posts enable row level security;

drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts
  for select to anon, authenticated
  using (true);

-- ===== Liu's Book (migration liu_book_minimal) =====
-- truyen chi hien thi cho nguoi doc khi published = true; chuong theo truyen cua no.
-- Ghi du lieu chi qua API server (service-role) sau khi kiem tra Admin.
create table if not exists public.books (
  id         uuid        primary key default gen_random_uuid(),
  title      text        not null check (char_length(title) between 1 and 200),
  published  boolean     not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.book_chapters (
  id         uuid        primary key default gen_random_uuid(),
  book_id    uuid        not null references public.books (id) on delete cascade,
  title      text        not null check (char_length(title) between 1 and 200),
  content    text        not null default '' check (char_length(content) <= 200000),
  position   integer     not null check (position > 0),
  created_at timestamptz not null default now()
);

create index if not exists book_chapters_book_position_idx
  on public.book_chapters (book_id, position);

alter table public.books         enable row level security;
alter table public.book_chapters enable row level security;

drop policy if exists "books_public_read" on public.books;
create policy "books_public_read" on public.books
  for select to anon, authenticated
  using (published);

drop policy if exists "book_chapters_public_read" on public.book_chapters;
create policy "book_chapters_public_read" on public.book_chapters
  for select to anon, authenticated
  using (exists (
    select 1 from public.books b
    where b.id = book_chapters.book_id and b.published
  ));

revoke all on public.books, public.book_chapters from anon, authenticated;
grant select on public.books, public.book_chapters to anon, authenticated;
grant select, insert, update, delete on public.books, public.book_chapters to service_role;
