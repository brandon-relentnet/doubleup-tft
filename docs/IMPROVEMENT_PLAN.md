# Improvement Plan

This plan focuses on reliability, code clarity, and better database usage without micro‑optimizing React.

## 1) REST Helper (reads)
- Add `src/lib/supaRest.ts` to centralize Supabase REST calls with:
  - Base URL + headers from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
  - `fetchJson(path, { timeoutMs, signal, prefer })` using `AbortController`.
  - `parseContentRange(res)` to read totals.
- Replace inline fetches in:
  - `src/routes/forum/index.tsx`
  - `src/components/forum/supa/PostDetail.tsx`
  - `src/components/forum/supa/Replies.tsx`
  - `src/routes/u.$name.tsx`

## 2) Unified Error UI
- Add `<FetchErrorCard message onRetry />` and reuse where we show error + retry.

## 3) Route Loaders (later)
- Move data fetching into file‑route loaders for:
  - Forum listing
  - Post detail
  - Profile page
- Use `useLoaderData` in components for simpler state.

## 4) DB Views + RPC (server efficiency)
- `forum_post_with_counts` view: posts + `reply_count` field.
- `reply_index(post_id, comment_id)` RPC: returns 1‑based index per `created_at` order.
- `profiles_by_name` view: resolves by `display_name_key` and can include latest post/comment timestamps.

## 5) Realtime (guarded re‑enable)
- Re‑enable only for forum listing insert/update/delete, with in‑flight guard and debounce.
- Add to replies after stabilized.

## 6) Profiles (avatars)
- Add Storage bucket `public/avatars`, client upload in `/account`, save public URL.

## 7) Polish
- Show reply counts on /forum (after view is available).
- Ensure width/height on any other large images to keep CLS at zero.

## 8) Tests
- Add small Vitest tests for `supaRest.fetchJson()` timeouts and `parseContentRange()`.

---

## Current Step
Implement steps (1) and (2): add `supaRest.ts`, refactor current REST calls to use it, and introduce `<FetchErrorCard />`.

