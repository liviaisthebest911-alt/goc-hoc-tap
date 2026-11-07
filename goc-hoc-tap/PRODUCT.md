# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primarily Vietnamese fellow learners who land on an article or a story and stay to look around. Liu is the author and the only admin.

## Product Purpose

OJM is Liu June Máth's personal learning and creative space: study notes, self-written stories, a reading shelf and small musical moments, in one place. Success means a visitor can find something worth reading quickly and leaves knowing who Liu is.

## Positioning

The one person writing both DSA notes and fiction, with music and binary as a shared motif. Nothing on the site is staged: every count and timeline entry comes from what has actually been published.

## Operating Context

Content is managed through the passcode-protected Admin (posts, stories, chapters). The reading shelf, manual moments and quotes are edited in `data/*.ts` and shipped by deploy.

## Capabilities and Constraints

- Next.js 16, React 19, hand-written CSS, Supabase (`posts`, `books`, `book_chapters`).
- No schema change or migration without Liu's approval. Auth and Admin stay as they are.
- "Liu's Book" means stories Liu writes (`/books`). The reading shelf is separate (`/shelf`).
- No `featured` column exists: the newest post is the featured one.
- Music is synthesized in the browser; no copyrighted audio.

## Brand Commitments

Name OJM; names A little world of Liu, Liu's Book, Little Moments, Music Corner; pale pink, serif, editorial; violin, piano, music notes, binary, `{ }`, `</>`; the current mascots. No dark theme, no dark brown or ivory as the main colour, no loud gradients, no heavy glassmorphism, no continuous animation.

## Evidence on Hand

Real posts and stories in Supabase, mascots in `public/mascots`. Absent and never to be invented: books Liu has read, achievements, projects, skills beyond published topics.

## Product Principles

1. Every number is computed, never typed.
2. An empty state is honest and still designed.
3. Interactions do something real.
4. Reading comes first on reading pages.
