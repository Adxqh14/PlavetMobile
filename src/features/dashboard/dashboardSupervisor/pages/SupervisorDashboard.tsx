"use client"

import { useSupervisorDashboard } from "../hooks/useSupervisorDashboard"
import { SupervisorHero } from "../components/SupervisorHero"
import { SupervisorStats } from "../components/SupervisorStats"
import { AlertsTable } from "../components/AlertsTable"
import { SupervisorControlPanel } from "../components/SupervisorControlPanel"
import { SupervisorFooter } from "../components/SupervisorFooter"

export function SupervisorDashboard() {
  const { data, loading, error } = useSupervisorDashboard()

  const stats = data?.stats
  const alertas = data?.alertas ?? []

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-8 space-y-10 pb-12 animate-in fade-in duration-700">
      
      <SupervisorHero />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      <SupervisorStats 
        stats={stats ? {
          estudiantes: stats.estudiantes,
          empresas: stats.empresas,
          tasa_exito: stats.tasa_exito,
          alertas_count: stats.alertas_count
        } : null} 
        loading={loading} 
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AlertsTable alertas={alertas} loading={loading} />
        </div>

        <div className="lg:col-span-4">
          <SupervisorControlPanel />
        </div>
      </div>

      <SupervisorFooter />
    </div>
  )
}
