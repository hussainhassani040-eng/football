import { fileURLToPath } from 'node:url'
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    fileURLToPath(new URL('./styles/main.css', import.meta.url))
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
})