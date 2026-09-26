import { useContext } from 'react'
import { SupabaseAuthContext } from '@/context/SupabaseAuthContext'
import type { SupabaseAuthContextValue } from '@/context/SupabaseAuthContext'

export function useSupabaseAuth(): SupabaseAuthContextValue {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}
