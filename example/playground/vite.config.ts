import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'leaflet-geo-tools': path.resolve(__dirname, '../../dist/index.esm.js')
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['leaflet', 'antd', '@turf/turf']
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  }
})
