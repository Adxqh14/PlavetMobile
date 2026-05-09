"use client"

import { useTutorBusinessDashboard } from "../hooks/useTutorBusinessDashboard"
import { BusinessHero } from "../components/BusinessHero"
import { InternsTable } from "../components/InternsTable"
import { BusinessStats } from "../components/BusinessStats"
import { BusinessActions } from "../components/BusinessActions"
import { BusinessFooter } from "../components/BusinessFooter"

export function TutorBusinessDashboard() {
  const { data, loading, error } = useTutorBusinessDashboard()

  const equipo = data?.equipo ?? []
  const evaluacionesPendientes = data?.evaluaciones_pendientes ?? 0

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-8 pb-12 animate-in fade-in duration-700">
      
      <BusinessHero />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      <InternsTable equipo={equipo} loading={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BusinessStats 
          pasantesCount={equipo.length}
          evaluacionesPendientes={evaluacionesPendientes}
          loading={loading}
        />
        <BusinessActions 
          empresa={data?.empresa}
          loading={loading}
        />
      </div>

      <BusinessFooter />
    </div>
  )
}
