import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { SupabaseAuthContext } from '@/context/SupabaseAuthContext'
import { supabase } from '@/lib/supabase'

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setInitializing(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error !== null) throw error
    return { needsConfirmation: data.session === null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error !== null) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error !== null) throw error
  }

  const user = session?.user ?? null

  return (
    <SupabaseAuthContext.Provider
      value={{ session, user, initializing, signUp, signIn, signOut }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}
