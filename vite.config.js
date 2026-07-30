import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => funciona em GitHub Pages (project site), Netlify e Cloudflare Pages sem ajuste.
// Usamos HashRouter no app, entao o refresh de rota nunca da 404.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
