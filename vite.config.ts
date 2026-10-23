import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { DEV_PROXY_TARGET } = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
    server: {
      host: true,
      proxy: {
        '/api': DEV_PROXY_TARGET,
        '/files': DEV_PROXY_TARGET,
      },
    },
  }
})
