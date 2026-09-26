-- ============================================================================
-- Second, EMPTY test account for the RLS isolation audit.
-- Login:  test2@example.com  /  password123
--
-- "Naked" on purpose: no habits, no logs. When this account signs in, RLS
-- must show an empty tracker (not an error, not account #1's data).
--
-- Re-runs are safe: if the email already exists, nothing happens.
-- ============================================================================

do $$
declare
  new_user_id uuid;
begin
  -- 1) Create the auth account (same shape GoTrue creates on app sign-up).
  --    crypt() bcrypt-hashes the password exactly like Supabase does.
  insert into auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'test2@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(), now(),
    '', '', '', ''
  )
  on conflict do nothing
  returning id into new_user_id;

  -- 2) If nothing was inserted, the account already exists: stop here.
  if new_user_id is null then
    raise notice 'test2@example.com already exists - nothing to do.';
    return;
  end if;

  -- 3) GoTrue also stores an identity row per provider; include it so
  --    password sign-in behaves exactly like a normal sign-up.
  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  )
  values (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', 'test2@example.com',
      'email_verified', true
    ),
    'email',
    new_user_id::text,
    now(), now(), now()
  )
  on conflict do nothing;

  raise notice 'Created test2@example.com / password123 (no habits, no logs).';
end $$;
