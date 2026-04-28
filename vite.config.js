import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      // สำหรับ API ปกติ
      '/api': {
        target: 'http://localhost:3999/',
        changeOrigin: true,
        secure: false,
      },
      // สำหรับ Socket.io
      '/socket.io': {
        target: 'http://localhost:3999/',
        changeOrigin: true,
        secure: false,
        ws: true, // 🌟 สำคัญมาก: ต้องเปิดเพื่อให้รองรับ WebSocket
      }
    }
  }
})