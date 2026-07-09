import type { SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'
import { createSupabaseClient } from '~/lib/supabase'

let supabase: SupabaseClient | null = null

export const useSupabase = () => {
  if (!supabase) {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl || import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = config.public.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY

    supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }

  return { supabase }
}
