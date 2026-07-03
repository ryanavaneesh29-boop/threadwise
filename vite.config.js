import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ml': ['@tensorflow/tfjs', '@tensorflow/tfjs-core'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
