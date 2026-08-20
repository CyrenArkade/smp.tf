import react from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },

  plugins: [
    rsc({
      entries: {
        rsc: './src/app/framework/entry.rsc.tsx',
        ssr: './src/app/framework/entry.ssr.tsx',
        client: './src/app/framework/entry.browser.tsx',
      },
    }),
    react(),
    tailwindcss(),
    svgr(),
    visualizer({
      filename: "./dist/stats.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      open: false,
    })
  ],
})
