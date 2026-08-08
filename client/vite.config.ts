import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite-plugin';  // ← 確認這個插件已安裝

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← 加入這行
  ],
});
