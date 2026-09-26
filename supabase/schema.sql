-- ============================================================================
-- Habit tracker schema
-- Paste this whole file into: Supabase Dashboard > SQL Editor > New query > Run
-- It is safe to re-run (idempotent).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) habits: one row per habit a user creates.
--    user_id points at auth.users (Supabase's built-in accounts table).
--    ON DELETE CASCADE: if the account is deleted, its habits go too.
-- ----------------------------------------------------------------------------
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 80),
  description text,
  created_at  timestamptz not null default now()
);

-- A unique (id, user_id) pair lets daily_logs build a composite foreign key
-- against it (see below) so a log can never point at someone else's habit.
create unique index if not exists habits_id_user_id_key
  on public.habits (id, user_id);

-- Speeds up the most common query: "all habits for this user".
create index if not exists habits_user_id_idx
  on public.habits (user_id);

-- ----------------------------------------------------------------------------
-- 2) daily_logs: one row per (habit, day).
--    Foreign key to habits with ON DELETE CASCADE: deleting a habit
--    automatically deletes all of its logs. Nothing left behind.
--    The composite FK (habit_id, user_id) guarantees the log's user_id is
--    always identical to its habit's user_id.
--    UNIQUE (habit_id, log_date): one log per habit per day, which is what
--    the app's upsert-on-toggle relies on.
-- ----------------------------------------------------------------------------
create table if not exists public.daily_logs (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null,
  user_id    uuid not null references auth.users (id) on delete cascade,
  log_date   date not null default current_date,
  completed  boolean not null default true,
  created_at timestamptz not null default now(),

  foreign key (habit_id, user_id)
    references public.habits (id, user_id)
    on delete cascade,

  unique (habit_id, log_date)
);

create index if not exists daily_logs_habit_id_idx
  on public.daily_logs (habit_id);

-- ============================================================================
-- 3) ROW LEVEL SECURITY -- the real security boundary.
--
--    RLS = every query run through the API (anon / authenticated roles) is
--    automatically filtered/policy-checked per row. Even if the React code
--    forgot a .eq("user_id", ...), the database would still refuse to leak
--    or modify another user's rows. The app-level .eq() calls are a
--    convenience; these policies are the last line of defense.
--
--    auth.uid() = the id of the signed-in user extracted from their JWT.
--    It is NULL for anonymous visitors.
-- ============================================================================

alter table public.habits enable row level security;
alter table public.daily_logs enable row level security;

-- ---------------------------- habits ----------------------------------------

-- SELECT: a signed-in user may read only rows whose user_id is their own.
-- USING is the filter applied to rows being read.
create policy "Users can select their own habits"
  on public.habits
  for select
  to authenticated
  using (auth.uid() = user_id);

-- INSERT: a signed-in user may create rows, but only if the row claims their
-- own user_id. WITH CHECK is the condition the NEW row must satisfy.
create policy "Users can insert their own habits"
  on public.habits
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- UPDATE: USING picks which existing rows may be changed; WITH CHECK makes
-- sure the row still belongs to them afterwards (no reassigning to someone
-- else's user_id).
create policy "Users can update their own habits"
  on public.habits
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: USING picks which rows may be removed -- only your own.
create policy "Users can delete their own habits"
  on public.habits
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- -------------------------- daily_logs --------------------------------------
-- Identical four policies, so users can log/check off habits, but can never
-- see or touch another account's logs.
-- ----------------------------------------------------------------------------

create policy "Users can select their own daily logs"
  on public.daily_logs
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own daily logs"
  on public.daily_logs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own daily logs"
  on public.daily_logs
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own daily logs"
  on public.daily_logs
  for delete
  to authenticated
  using (auth.uid() = user_id);
