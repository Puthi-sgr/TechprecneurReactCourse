import { fileURLToPath, URL } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function appShellPrecache() {
  return {
    name: 'app-shell-precache',
    apply: 'build' as const,
    closeBundle() {
      const outputDir = resolve(process.cwd(), 'dist')
      const html = readFileSync(resolve(outputDir, 'index.html'), 'utf8')
      const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map((match) => match[1])
      const cacheList = [...new Set(['/','/index.html','/manifest.webmanifest','/favicon.svg','/icons/icon-192.png','/icons/icon-512.png','/offline.html',...assets])]
      const workerPath = resolve(outputDir, 'sw.js')
      const worker = readFileSync(workerPath, 'utf8').replace("const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/offline.html']", `const APP_SHELL = ${JSON.stringify(cacheList)}`)
      writeFileSync(workerPath, worker)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    appShellPrecache(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
