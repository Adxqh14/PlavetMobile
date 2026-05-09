import { Briefcase, Building2, MapPin, Users, Clock, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"

interface InternshipStatusProps {
  empresa?: string
  estado?: string
  tutor?: string
  totalHoras?: number
  loading: boolean
}

export function InternshipStatus({ empresa, estado, tutor, totalHoras, loading }: InternshipStatusProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1 text-primary">
        <Briefcase className="h-5 w-5" />
        <h2 className="text-xl font-black text-foreground tracking-tight">Mi Pasantía Actual</h2>
      </div>

      <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Cargando datos...
            </div>
          ) : (
            <div className="divide-y">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-foreground">{empresa ?? "Sin empresa asignada"}</h4>
                    <p className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">
                      <MapPin className="h-3 w-3 text-primary" />
                      {estado ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 divide-x divide-y sm:divide-y-0">
                <div className="p-6 bg-muted/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Tutor Asignado</p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-bold text-foreground">{tutor ?? "—"}</p>
                  </div>
                </div>
                <div className="p-6 bg-muted/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Total de Horas</p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="font-bold text-foreground">{totalHoras ? `${totalHoras} Horas` : "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
