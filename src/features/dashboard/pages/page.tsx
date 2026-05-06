"use client"

import Main from "@/features/main/pages/page"
import { useTour } from "../../../shared/hooks/useTour"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { LayoutDashboard } from "lucide-react"

import { StudentDashboard } from "../components/StudentDashboard"
import { TutorAcademicDashboard } from "../components/TutorAcademicDashboard"
import { TutorBusinessDashboard } from "../components/TutorBusinessDashboard"
import { SupervisorDashboard } from "../components/SupervisorDashboard"
import { VinculadorDashboard } from "../components/VinculadorDashboard"
import { AdminDashboard } from "../components/AdminDashboard"

export default function DashboardPage() {
  const { userRole } = useAuth();

  useTour('tutorial_visto', [
    { element: '#tour-welcome', popover: { title: 'Bienvenido', description: 'Este es el Panel de Control principal de Plavet.', side: "bottom", align: 'start' }},
    { element: '#tour-kpis', popover: { title: 'Métricas Clave', description: 'Aquí puedes ver un resumen rápido de indicadores.', side: "right", align: 'start' }},
  ], 500);

  return (
    <Main>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 md:px-8 md:py-8">
          {userRole === "ESTUDIANTE" ? (
            <StudentDashboard />
          ) : userRole === "TUTOR ACADEMICO" ? (
            <TutorAcademicDashboard />
          ) : userRole === "TUTOR EMPRESARIAL" ? (
            <TutorBusinessDashboard />
          ) : userRole === "SUPERVISOR" ? (
            <SupervisorDashboard />
          ) : userRole === "VINCULADOR" ? (
            <VinculadorDashboard />
          ) : userRole === "ADMINISTRADOR" ? (
            <AdminDashboard />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                 <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold">Vista no configurada</h2>
              <p className="text-muted-foreground">No tienes un panel de control asignado para tu rol actual.</p>
            </div>
          )}
        </div>
      </div>
    </Main>
  )
}