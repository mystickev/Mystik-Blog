import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If hosting on GitHub Pages WITHOUT a custom domain, set base to your repo name:
// base: '/your-repo-name/'
// If using a custom domain (mystikev.co.ke) OR hosting on cPanel/Apache/Netlify/Vercel:
// base: '/' (default, leave as-is)

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    // Splits admin bundle separately — admin code loads only when needed
    rollupOptions: {
      output: {
        manualChunks: {
          admin: [
            './src/admin/Login.jsx',
            './src/admin/Dashboard.jsx',
            './src/admin/PostEditor.jsx',
            './src/admin/ResourceEditor.jsx',
            './src/admin/AboutEditor.jsx',
          ]
        }
      }
    }
  }
})
