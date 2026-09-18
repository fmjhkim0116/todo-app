import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['favicon.svg'],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: '할일 목록',
        short_name: '할일 목록',
        description: '우선순위와 로컬 저장을 지원하는 할일 관리 앱',
        start_url: '/',
        display: 'standalone',
        background_color: '#f6f4ef',
        theme_color: '#2f6f5e',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
