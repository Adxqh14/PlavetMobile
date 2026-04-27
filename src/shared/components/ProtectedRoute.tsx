import { type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { canAccessRoute } from "@/shared/config/rbac"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userRole } = useAuth();
  const location = useLocation();

  if (!canAccessRoute(userRole, location.pathname)) {
    // Si no tiene acceso, redirigir al dashboard por defecto o mostrar una página de error
    // Para simplificar, redirigimos al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
