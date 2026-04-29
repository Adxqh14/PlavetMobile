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
            // Permite que las cookies Set-Cookie del backend lleguen al navegador
            const cookies = proxyRes.headers["set-cookie"]
            if (cookies) {
              proxyRes.headers["set-cookie"] = cookies.map((c) =>
                c.replace(/; secure/gi, "").replace(/; samesite=strict/gi, "; SameSite=Lax")
              )
            }
          })
        },
      },
    },
  },
})