import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from GitHub Pages at https://<user>.github.io/receiper-clone/
// so all asset URLs must be prefixed with the repo name.
export default defineConfig({
  base: '/receiper-clone/',
  plugins: [react(), tailwindcss()],
})
