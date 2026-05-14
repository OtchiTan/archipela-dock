import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:30000',
        changeOrigin: true,
        ws: true,
      },
      '/events': {
        target: 'http://localhost:30000',
        changeOrigin: true,
      },
      '/ap-events': {
        target: 'http://localhost:30000',
        changeOrigin: true,
      },
    },
  },
})
