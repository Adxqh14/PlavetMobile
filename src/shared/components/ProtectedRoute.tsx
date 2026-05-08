import { type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { canAccessRoute } from "@/shared/config/rbac"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userRole, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canAccessRoute(userRole, location.pathname)) {
    // Si tiene sesión pero no tiene acceso al rol, redirigir al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
