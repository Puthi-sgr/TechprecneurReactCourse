import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  !supabaseUrl.includes('REPLACE-ME') &&
  !supabaseAnonKey.includes('REPLACE-ME')

export const supabase = createClient(
  supabaseUrl.length > 0 ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey.length > 0 ? supabaseAnonKey : 'placeholder-anon-key',
)
