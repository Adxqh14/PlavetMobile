"use client"

import { useVinculadorDashboard } from "../hooks/useVinculadorDashboard"
import { VinculadorHero } from "../components/VinculadorHero"
import { VinculadorStats } from "../components/VinculadorStats"
import { VinculadorActions } from "../components/VinculadorActions"
import { VinculadorFooter } from "../components/VinculadorFooter"

export function VinculadorDashboard() {
  const { data, loading, error } = useVinculadorDashboard()

  const stats = data?.stats ?? null

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-10 pb-12 animate-in fade-in duration-700">
      
      <VinculadorHero />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      <VinculadorStats stats={stats} loading={loading} />

      <VinculadorActions />

      <VinculadorFooter />
    </div>
  )
}
