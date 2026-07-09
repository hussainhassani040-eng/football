import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { navigateTo, useState } from '#imports'

let authListenerReady = false

export const useAuth = () => {
  const { supabase } = useSupabase()
  const user = useState<User | null>('auth-user', () => null)
  const session = useState<Session | null>('auth-session', () => null)
  const loading = useState('auth-loading', () => false)
  const initialized = useState('auth-initialized', () => false)

  const applySession = (nextSession: Session | null) => {
    session.value = nextSession
    user.value = nextSession?.user ?? null
  }

  const initialize = async () => {
    if (!import.meta.client || initialized.value) {
      return
    }

    loading.value = true

    try {
      const { data, error } = await supabase.auth.getSession()

      if (!error) {
        applySession(data.session)
      }

      if (!authListenerReady) {
        authListenerReady = true
        supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
          applySession(nextSession)
        })
      }

      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    const result = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false

    if (result.error) {
      throw result.error
    }

    applySession(result.data.session)
    return result.data
  }

  const signUp = async (email: string, password: string) => {
    loading.value = true
    const result = await supabase.auth.signUp({ email, password })
    loading.value = false

    if (result.error) {
      throw result.error
    }

    applySession(result.data.session)
    return result.data
  }

  const signOut = async () => {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    loading.value = false

    if (error) {
      throw error
    }

    applySession(null)
    await navigateTo('/login')
  }

  return {
    user,
    session,
    loading,
    initialized,
    initialize,
    signIn,
    signUp,
    signOut
  }
}
