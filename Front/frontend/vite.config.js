import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tudo que o React chamar em /api é repassado para o backend na porta 3000.
// Assim o navegador não bloqueia (CORS) e o backend não precisa mudar.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
