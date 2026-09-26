import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export interface SupabaseAuthContextValue {
  session: Session | null
  user: User | null
  initializing: boolean
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const SupabaseAuthContext = createContext<SupabaseAuthContextValue | undefined>(
  undefined,
)
