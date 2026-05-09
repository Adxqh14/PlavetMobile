"use client"

import { useAdminDashboard } from "../hooks/useAdminDashboard"
import { AdminHero } from "../components/AdminHero"
import { AdminStats } from "../components/AdminStats"
import { AdminInstitutionalGrid } from "../components/AdminInstitutionalGrid"
import { AdminOperationalGrid } from "../components/AdminOperationalGrid"
import { AdminFooter } from "../components/AdminFooter"

export function AdminDashboard() {
  const { data, loading, error } = useAdminDashboard()

  const apiStats = data?.stats

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-10 pb-12 animate-in fade-in duration-700">
      
      <AdminHero />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      <AdminStats 
        usuariosTotales={apiStats?.usuarios_totales ?? "—"} 
        programasActivos={apiStats?.programas_activos ?? "—"} 
        loading={loading} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AdminInstitutionalGrid />
        <AdminOperationalGrid />
      </div>

      <AdminFooter />
    </div>
  )
}
