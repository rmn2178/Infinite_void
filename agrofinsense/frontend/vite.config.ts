import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/health': 'http://localhost:8000',
      '/farmer': 'http://localhost:8000',
      '/market': 'http://localhost:8000',
      '/govtech': 'http://localhost:8000',
      '/scheme': 'http://localhost:8000',
    }
  }
})
