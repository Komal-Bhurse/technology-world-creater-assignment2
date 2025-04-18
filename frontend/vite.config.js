import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {

  },
  
  server: {
    proxy: {
      "/api": {
        target: "https://technology-world-creater-assignment2.vercel.app/",
        secure: true,
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
