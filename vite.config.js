// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Port différent de BusCam (5173) pour pouvoir tourner en même temps
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Spring Boot port 8081
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: { outDir: 'dist', sourcemap: true }
})
