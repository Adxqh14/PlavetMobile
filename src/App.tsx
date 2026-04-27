import RoutersProtected from "./App/router/routers"
import { ThemeProvider } from "./features/main/components/theme-provider"
import { AuthProvider } from "./features/auth/context/AuthContext"

export default function App({ children }: { children?: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
        <RoutersProtected />
      </ThemeProvider>
    </AuthProvider>
  )
}
