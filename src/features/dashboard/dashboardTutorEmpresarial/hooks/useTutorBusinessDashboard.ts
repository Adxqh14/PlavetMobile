import { useState, useEffect } from "react"
import { dashboardService, type TutorEmpresarialDashboardData } from "../../services/dashboardService"

export function useTutorBusinessDashboard() {
  const [data, setData] = useState<TutorEmpresarialDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    dashboardService.getTutorEmpresarialDashboard()
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
