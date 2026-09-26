-- ============================================================================
-- Seed data
-- Run this AFTER you have signed up once in the app (it seeds the first
-- account it finds). Safe to re-run: existing rows are skipped.
-- ============================================================================

do $$
declare
  seed_user_id uuid;
begin
  -- Find the first account that exists in this project.
  select id into seed_user_id
  from auth.users
  order by created_at asc
  limit 1;

  if seed_user_id is null then
    raise notice 'No users found. Sign up in the app first, then re-run this seed.';
    return;
  end if;

  raise notice 'Seeding habits for user: %', seed_user_id;

  -- Three starter habits for that user.
  insert into public.habits (user_id, name, description)
  values
    (seed_user_id, 'Read 20 minutes', 'A book, an article, anything counts.'),
    (seed_user_id, 'Morning stretch', 'Five minutes before coffee.'),
    (seed_user_id, 'Drink 2L of water', 'Refill the bottle four times.')
  on conflict do nothing;

  -- Three days of completed logs (yesterday and the two days before).
  -- Today is deliberately left empty so you can test the toggle in the app.
  -- The unique (habit_id, log_date) constraint makes re-runs a no-op.
  insert into public.daily_logs (habit_id, user_id, log_date, completed)
  select h.id, h.user_id, current_date - d.day, true
  from public.habits h
  cross join generate_series(1, 3) as d (day)
  where h.user_id = seed_user_id
  on conflict do nothing;
end $$;
