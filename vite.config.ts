import { defineConfig } from "vite";
import path from 'node:path'
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['lodash', 'axios']
    }
  },
  plugins: createVitePlugins(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, 'src/types'),
    },
  },
  // css预处理器
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/style/index.scss";`,
      },
    },
  }
});
