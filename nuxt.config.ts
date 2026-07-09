import { fileURLToPath } from 'node:url'
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
    }
  },

  css: [
    fileURLToPath(new URL('./styles/main.css', import.meta.url))
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
})
