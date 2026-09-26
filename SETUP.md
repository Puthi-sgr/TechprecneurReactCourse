# Capstone setup — Supabase backend for the habit tracker

Code is done and waiting. This file walks you through the **dashboard side** (your part), then the audit checklist from the mission.

---

## Part A — Create the Supabase project (~5 min)

1. Go to <https://supabase.com> → **Sign in** (GitHub works) → **New project**.
2. Pick your org (or create one), then:
   - **Name:** `habit-tracker-capstone` (anything works)
   - **Database password:** generate one and save it somewhere (you rarely need it again)
   - **Region:** closest to you
3. Click **Create new project** and wait ~2 minutes while it provisions.

## Part B — Put the keys in `.env`

1. In the dashboard open **Project Settings (gear icon) → API**.
2. Copy **Project URL** — it looks like `https://abcdefgh.supabase.co`.
3. Copy the **anon / publishable** key (a long `eyJ...` or `sb_publishable_...` string).
   - This key is *designed* to be public — it can only do what RLS allows.
   - The `service_role` key must **never** leave the dashboard. Never paste it into `.env`.
4. Open `TechprecneurReactCourse/.env` and replace both placeholders:

   ```
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-real-key
   ```

5. Restart `npm run dev` (Vite only reads `.env` at startup).

## Part C — Create the tables + RLS (SQL editor)

1. Dashboard → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` in this repo, copy **the whole file**, paste, **Run**.
3. Verify: **Table Editor** → you should see `habits` and `daily_logs`.
4. Verify RLS is on: Table Editor → `habits` → the shield icon should say **RLS enabled**.

## Part D — Sign up, then seed

1. `npm run dev` → open the app → **Habit Tracker** (redirects to `/login`) → **Sign up** with a real email + password (min 8 chars).
   - If Supabase asks you to confirm your email, either click the link in the inbox, or for quicker homework testing: **Authentication → Sign In / Providers → Email → toggle off "Confirm email"**, then sign up again.
2. Back in the dashboard → **SQL Editor** → paste `supabase/seed.sql` → **Run**.
   It finds your account automatically and seeds 3 habits + 3 days of logs.
3. Reload the tracker page — you should see the seeded habits, and **today** is unticked so you can test the toggle.

---

## Audit checklist (from the mission — run all four)

### 1. `git status` shows no `.env`

```powershell
git status
```

`.env` must NOT appear (`.env.example` may). If it does, stop and fix before committing anything.

### 2. A second account sees an EMPTY list (not an error)

1. Sign out → **Sign up** a second account (use a different email, e.g. `test2@example.com`).
2. The tracker must show *"No habits yet — add your first one above."*
   - NOT the seeded habits, NOT an error, NOT a spinner stuck forever.
   - This is RLS working: `auth.uid() = user_id` filters out account #1's rows.
3. Sign back into account #1 — its habits are still there.

### 3. Deleting a habit removes its logs

1. On any habit with logs, click **Delete** → **Really delete?**
2. Dashboard → **Table Editor → daily_logs** → the deleted habit's log rows are gone.
   That's the `ON DELETE CASCADE` foreign key at work — no orphan logs.

### 4. Refresh loses nothing

Hard-refresh the tracker (Ctrl+Shift+R) with account #1:
- Still signed in (session is restored by `onAuthStateChange` from local storage).
- Same habits, same "done today" states — everything comes from Supabase, nothing from React state that evaporates.

---

## Where each requirement lives (for your write-up)

| Mission item | File |
| --- | --- |
| Supabase client + env vars | `src/lib/supabase.js`, `.env` (gitignored) |
| Tables + FK cascade + seed | `supabase/schema.sql`, `supabase/seed.sql` |
| Sign-up / sign-in forms | `src/pages/SignupPage.tsx`, `src/pages/LoginPage.tsx` |
| Session via `onAuthStateChange` | `src/context/SupabaseAuthContext.tsx` |
| Route guard → `/login` | `src/components/ProtectedRoute.tsx` |
| Full CRUD + loading/error states | `src/pages/TrackerPage.tsx`, `src/components/habits/*` |
| RLS: own-rows-only on both tables | `supabase/schema.sql` (section 3) |

## Understanding check — be ready to answer these

- Why does every query in `TrackerPage.tsx` also call `.eq('user_id', user.id)` when RLS already filters?
  → Defense in depth + correct behavior (writes need `user_id`; reads save the round-trip of rows RLS would discard anyway).
- `USING` vs `WITH CHECK` on the UPDATE policy?
  → `USING` selects which *existing* rows you may touch; `WITH CHECK` validates what the row looks like *after* your change (stops re-assigning a habit to another user).
- Why `to authenticated` on every policy?
  → Anonymous visitors get zero policies, so they see nothing at all — even the query itself is pointless without a JWT.
- Why is the anon key safe to ship in the browser bundle?
  → It only authenticates "who is calling"; RLS decides "what they may touch". The `service_role` key bypasses RLS and must never be in `.env`.
- How does `ON DELETE CASCADE` differ from deleting logs manually in React first?
  → The database guarantees atomicity: habit + logs vanish together in one statement, no orphan rows even if the app crashes mid-delete.

## Optional: see RLS block a query with your own eyes

In the SQL editor (runs as the table **owner**, which bypasses RLS — that's why you see everything there):

```sql
begin;
  set local role authenticated;                      -- act like the browser's role
  set local request.jwt.claims to '{"sub": "PASTE-A-USER-ID-HERE", "role": "authenticated"}';
  select count(*) from public.habits;                -- only THAT user's rows
  set local request.jwt.claims to '{"sub": "someone-else", "role": "authenticated"}';
  select count(*) from public.habits;                -- returns 0 for a fake user id
rollback;
```

Paste a real user id from **Authentication → Users** into the first claim to see it count rows, then watch the fake id get zero.
