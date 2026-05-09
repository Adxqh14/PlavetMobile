"use client"

import { useStudentDashboard } from "../hooks/useStudentDashboard"
import { DashboardHero } from "../components/DashboardHero"
import { StatsGrid } from "../components/StatsGrid"
import { InternshipStatus } from "../components/InternshipStatus"
import { QuickActions } from "../components/QuickActions"
import { DashboardFooter } from "../components/DashboardFooter"

export function StudentDashboard() {
  const { data, loading, error } = useStudentDashboard()

  const pasantia = data?.pasantia
  const estadisticas = data?.estadisticas
  const porcentaje = pasantia?.progreso ? Math.round(pasantia.progreso.porcentaje) : 0

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-8 space-y-10 pb-12 animate-in fade-in duration-700">
      
      <DashboardHero estadoPasantia={pasantia?.estado} />

      {error && (
        <div className="mx-6 md:px-12">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">
            {error}
          </div>
        </div>
      )}

      <StatsGrid 
        documentos={estadisticas?.documentos ?? "—"} 
        excusas={estadisticas?.excusas ?? "—"} 
        porcentaje={porcentaje}
        loading={loading}
      />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <InternshipStatus 
            empresa={pasantia?.empresa}
            estado={pasantia?.estado}
            tutor={pasantia?.tutor}
            totalHoras={pasantia?.progreso.total}
            loading={loading}
          />
        </div>

        <div className="space-y-8">
          <QuickActions />
        </div>
      </div>

      <DashboardFooter />
    </div>
  )
}
