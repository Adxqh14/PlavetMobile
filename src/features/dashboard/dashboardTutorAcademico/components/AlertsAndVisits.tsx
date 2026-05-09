import { AlertTriangle, ClipboardCheck, Clock, Calendar, ArrowRight, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"
import { Button } from "../../../../shared/components/ui/button"
import { Badge } from "../../../../shared/components/ui/badge"

interface Excusa {
  id: string
  estudiante_nombre: string
  fecha: string
}

interface Visita {
  empresa: string
  estudiante_nombre: string
  fecha: string
}

interface AlertsAndVisitsProps {
  excusas: Excusa[]
  visitas: Visita[]
  loading: boolean
}

export function AlertsAndVisits({ excusas, visitas, loading }: AlertsAndVisitsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Alertas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-xl font-black text-foreground tracking-tight">Alertas Pendientes</h2>
          </div>
          <Badge className="bg-amber-500/10 text-amber-600 border-0 font-black rounded-lg px-3 py-1">
            {loading ? "—" : excusas.length} Pendientes
          </Badge>
        </div>
        <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
          <CardContent className="p-0 flex-1">
            {loading ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin opacity-20" /></div>
            ) : excusas.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-2 text-muted-foreground">
                <ClipboardCheck className="h-10 w-10 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-40">Sin pendientes</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {excusas.slice(0, 5).map((excusa) => (
                  <div key={excusa.id} className="p-5 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 group">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{excusa.estudiante_nombre}</p>
                      <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {excusa.fecha}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">Revisar</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Próximas Visitas */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1 text-primary">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-black text-foreground tracking-tight">Calendario de Visitas</h2>
        </div>
        <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
          <CardContent className="p-0 flex-1">
            {loading ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin opacity-20" /></div>
            ) : visitas.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-2 text-muted-foreground">
                <Calendar className="h-10 w-10 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-40">Sin visitas programadas</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {visitas.slice(0, 5).map((visita, i) => {
                  const fechaDate = new Date(visita.fecha)
                  const dia = fechaDate.getDate()
                  const mes = fechaDate.toLocaleString("es", { month: "short" }).toUpperCase()
                  return (
                    <div key={i} className="p-5 hover:bg-muted/30 transition-all flex items-center gap-5 group">
                      <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center shrink-0 transition-all group-hover:bg-primary group-hover:border-primary">
                        <span className="text-[10px] font-black text-primary uppercase group-hover:text-white tracking-widest leading-none mb-0.5">{mes}</span>
                        <span className="text-2xl font-black text-primary leading-none group-hover:text-white">{dia}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors">{visita.empresa}</p>
                        <p className="text-[12px] text-muted-foreground font-bold truncate">{visita.estudiante_nombre}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
