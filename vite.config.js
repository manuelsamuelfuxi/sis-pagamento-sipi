import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const alvoProxy = env.VITE_PROXY_ALVO

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      // Só activo em desenvolvimento, quando VITE_PROXY_ALVO está definido
      proxy: alvoProxy
        ? {
            '/api': {
              target: alvoProxy,
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },
  }
})