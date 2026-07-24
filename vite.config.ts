import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  server: {
    host: '127.0.0.1',
    port: 3020,
    strictPort: false,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 3020,
    strictPort: false,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
})