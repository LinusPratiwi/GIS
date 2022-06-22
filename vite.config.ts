import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path/posix'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})