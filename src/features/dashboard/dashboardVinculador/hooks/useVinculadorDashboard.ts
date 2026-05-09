import { useState, useEffect } from "react"
import { dashboardService, type VinculadorDashboardData } from "../../services/dashboardService"

export function useVinculadorDashboard() {
  const [data, setData] = useState<VinculadorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    dashboardService.getVinculadorDashboard()
      .then(res => {
        if (isMounted) {
          if (res.success) setData(res.data)
          else setError("No se pudo cargar el dashboard.")
        }
      })
      .catch(() => {
        if (isMounted) setError("Error al conectar con el servidor.")
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    
    return () => { isMounted = false }
  }, [])

  return { data, loading, error }
}
