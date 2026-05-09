"use client"

import { useTutorAcademicDashboard } from "../hooks/useTutorAcademicDashboard"
import { TutorAcademicHero } from "../components/TutorAcademicHero"
import { TutorAcademicStats } from "../components/TutorAcademicStats"
import { WorkshopPerformance } from "../components/WorkshopPerformance"
import { AlertsAndVisits } from "../components/AlertsAndVisits"
import { AcademicActions } from "../components/AcademicActions"
import { TutorAcademicFooter } from "../components/TutorAcademicFooter"

export function TutorAcademicDashboard() {
  const { data, loading, error } = useTutorAcademicDashboard()

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-10 pb-12 animate-in fade-in duration-700">
      
      <TutorAcademicHero />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      <TutorAcademicStats 
        stats={data ? {
          total_estudiantes: data.resumen.total_estudiantes,
          en_proceso: data.resumen.distribucion.en_proceso,
          en_riesgo: data.resumen.distribucion.en_riesgo,
          finalizados: data.resumen.distribucion.finalizados
        } : null}
        loading={loading}
      />

      <WorkshopPerformance 
        metricas={data?.resumen.metricas}
        loading={loading}
      />

      <AlertsAndVisits 
        excusas={data?.excusas_por_validar ?? []}
        visitas={data?.proximas_visitas ?? []}
        loading={loading}
      />

      <AcademicActions />

      <TutorAcademicFooter />
    </div>
  )
}
