import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const BACKEND_URL = "https://backend-check-in-gik5.onrender.com"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // En desarrollo, /api/* se reenvía al backend → sin CORS
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            // Permite que las cookies Set-Cookie del backend lleguen al navegador en localhost
            const cookies = proxyRes.headers["set-cookie"]
            if (cookies) {
              proxyRes.headers["set-cookie"] = cookies.map((c) =>
                c
                  // 1. Quitar el flag Secure (localhost no es HTTPS)
                  .replace(/;\s*secure/gi, "")
                  // 2. SameSite=None requiere Secure → bajar a Lax para localhost
                  .replace(/;\s*samesite=none/gi, "; SameSite=Lax")
                  // 3. SameSite=Strict también → Lax para que funcione con el proxy
                  .replace(/;\s*samesite=strict/gi, "; SameSite=Lax")
                  // 4. Eliminar Domain= para que la cookie se asigne a localhost
                  .replace(/;\s*domain=[^;]*/gi, "")
              )
            }
          })
        },
      },
    },
  },
})