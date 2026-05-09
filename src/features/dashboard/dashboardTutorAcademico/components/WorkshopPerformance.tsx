import { TrendingUp, Clock, BookOpen, FileText, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"

interface WorkshopPerformanceProps {
  metricas?: {
    progreso_prom: string
    horas_prom: string
    docs_completos: number
  }
  loading: boolean
}

export function WorkshopPerformance({ metricas, loading }: WorkshopPerformanceProps) {
  const items = [
    { label: "Progreso Promedio del Grupo", value: metricas?.progreso_prom ?? "—", icon: Clock, desc: "Avance porcentual en el plan" },
    { label: "Horas Promedio Registradas", value: metricas?.horas_prom ?? "—", icon: BookOpen, desc: "Total de horas acumuladas" },
    { label: "Expedientes Completos", value: loading ? "—" : `${metricas?.docs_completos ?? 0} estudiantes`, icon: FileText, desc: "Documentación validada" },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1 text-primary">
        <TrendingUp className="h-5 w-5" />
        <h2 className="text-xl font-black text-foreground tracking-tight">Rendimiento del Taller</h2>
      </div>
      <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
            {items.map((item, i) => (
              <div key={i} className="flex flex-col justify-between p-8 hover:bg-muted/30 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground font-bold">{item.desc}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-black text-primary leading-none">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
