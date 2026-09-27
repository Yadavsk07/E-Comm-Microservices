import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const proxyTarget =
    env.VITE_PROXY_TARGET ||
    (env.VITE_API_BASE_URL && env.VITE_API_BASE_URL.startsWith('http')
      ? env.VITE_API_BASE_URL
      : 'http://localhost:8080')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          ...(env.VITE_API_TIMEOUT
            ? {
                timeout: Number(env.VITE_API_TIMEOUT),
                proxyTimeout: Number(env.VITE_API_TIMEOUT),
              }
            : {}),
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error(`[Vite Proxy] Failed to forward request to backend (${proxyTarget}): ${err.message}`);
            });
          },
        },
      },
    },
  }
})
