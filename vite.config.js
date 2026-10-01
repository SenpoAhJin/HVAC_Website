import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import envReplacePlugin from './vite-plugin-env-replace.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), envReplacePlugin()],
  base: process.env.VITE_BASE || '/',
})
