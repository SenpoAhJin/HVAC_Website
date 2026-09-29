import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use repository name for GitHub Pages, root for Vercel
  // Vercel automatically sets VERCEL=1, GitHub Actions doesn't set it
  base: process.env.VERCEL ? '/' : '/HVAC_Website/',
})
