import { createClient } from '@supabase/supabase-js'

export const createSupabaseClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: import.meta.client
    }
  })
}
