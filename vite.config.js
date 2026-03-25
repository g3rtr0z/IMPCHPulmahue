import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
// Tailwind v4 se procesa vía PostCSS (@tailwindcss/postcss en postcss.config.js)
export default defineConfig({
  plugins: [react()],
})
