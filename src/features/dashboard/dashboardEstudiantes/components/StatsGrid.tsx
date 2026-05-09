import { FileText, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"

interface StatsGridProps {
  documentos: string | number
  excusas: string | number
  porcentaje: number
  loading: boolean
}

export function StatsGrid({ documentos, excusas, porcentaje, loading }: StatsGridProps) {
  const kpis = [
    {
      title: "Documentos",
      value: documentos,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-500/5",
    },
    {
      title: "Mis Excusas",
      value: excusas,
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-500/5",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((s, i) => (
        <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.title}</p>
              <p className="text-2xl font-black text-foreground">
                {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : s.value}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${s.bg} group-hover:scale-110 transition-transform`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
      <Card className="md:col-span-2 border-none bg-primary/5 shadow-none rounded-2xl p-5 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Progreso de Pasantía</p>
          <span className="text-sm font-black text-primary">{porcentaje}%</span>
        </div>
        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${porcentaje}%` }} />
        </div>
      </Card>
    </div>
  )
}
