# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

The Next.js app is in the nested `goc-hoc-tap/` directory, not the git root. Run all commands from there. `@/*` resolves to that directory.

## Commands

```bash
cd goc-hoc-tap
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

There is no test framework or test script. `tsc` is not wired to a script; use `npx tsc --noEmit` for a type check.

## Next.js version

This is Next 16.4 with React 19.3, and it has breaking changes from what you may expect. Before writing Next.js code, read the relevant guide in `goc-hoc-tap/node_modules/next/dist/docs/` and heed deprecation notices (from `goc-hoc-tap/AGENTS.md`).

`next dev` rewrites the marked block in `AGENTS.md`. If that shows up as a diff, commit it rather than removing it, since it will only come back.

## Environment

`.env.example` lists the required variables. `.env*` files are otherwise gitignored.

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `lib/supabase.ts` throws at import time if either is missing, so `dev` and `build` fail on any page that imports it.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only, used for writes.
- `ADMIN_PASSCODE` and `ADMIN_SESSION_SECRET` (at least 32 characters): if either is missing, admin login and sessions are rejected.

## Architecture

A personal blog and portfolio, branded OJM. The UI text is mostly Vietnamese. Posts live in a Supabase `posts` table defined in `supabase/schema.sql`. `created_at` is the publish date and is editable; RLS lets the anon key read only, so that file must be applied for the data to be protected.

- **Reads** happen in server components through the anon client in `lib/supabase.ts` and the helpers in `lib/posts.ts`, with `revalidate = 60`. Query errors throw to `app/error.tsx`, so an outage is not shown as an empty blog.
- **Writes** go through `app/api/posts` (`POST`) and `app/api/posts/[id]` (`PATCH`, `DELETE`). Each handler checks `isAdmin()`, validates with `lib/post-input.ts`, writes with the service-role client from `lib/supabase-admin.ts`, then calls `revalidatePath("/", "layout")` so changes appear at once.
- **Auth** is in `lib/auth.ts`: one shared passcode, exchanged at `app/api/admin/session` for an HMAC-signed httpOnly cookie with a 12-hour hard expiry. There is no session table, so logout clears only that browser's cookie. Pages under `/admin` and `/write` call `requireAdmin()` individually. Do not read cookies in the root layout or `Header`, because that would turn every public page dynamic and lose ISR.
- **Markdown** is rendered by `components/Markdown.tsx` in the post page and the editor preview.
- **Topics** are the free-text `tag` column. `/topics/[tag]` lists a topic and `listTopics` derives the list from the loaded posts.

**Styling** is hand-written CSS in `app/globals.css`, using class names and `:root` color tokens. Tailwind is listed in `package.json` but is not imported or configured, so utility classes do nothing. Fonts come from `next/font` in `app/layout.tsx` as CSS variables. Dates are formatted in `Asia/Ho_Chi_Minh` through `lib/utils.ts`.
