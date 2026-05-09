"use client"

import Main from "@/features/main/pages/page"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { LayoutDashboard } from "lucide-react"

import { StudentDashboard } from "../dashboardEstudiantes/pages/StudentDashboard"
import { TutorAcademicDashboard } from "../dashboardTutorAcademico/pages/TutorAcademicDashboard"
import { TutorBusinessDashboard } from "../dashboardTutorEmpresarial/pages/TutorBusinessDashboard"
import { SupervisorDashboard } from "../dashboardSupervisor/pages/SupervisorDashboard"
import { VinculadorDashboard } from "../dashboardVinculador/pages/VinculadorDashboard"
import { AdminDashboard } from "../dashboardAdministrador/pages/AdminDashboard"

export default function DashboardPage() {
  const { userRole } = useAuth();

  return (
    <Main>
      <div className="min-h-screen bg-background p-6 md:p-12">
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
    </Main>
  )
}