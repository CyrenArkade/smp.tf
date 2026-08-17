import react from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { resolve } from 'path'

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
    rsc(),
    react(),
    tailwindcss(),
  ],

  environments: {
    rsc: {
      build: {
        rollupOptions: {
          input: {
            index: './src/app/framework/entry.rsc.tsx',
          },
        },
      },
    },
    ssr: {
      build: {
        rollupOptions: {
          input: {
            index: './src/app/framework/entry.ssr.tsx',
          },
        },
      },
    },
    client: {
      build: {
        rollupOptions: {
          input: {
            index: './src/app/framework/entry.browser.tsx',
          },
        },
      },
    },
  },
})
