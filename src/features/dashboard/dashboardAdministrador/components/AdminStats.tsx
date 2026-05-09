import { Users, Building2, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"

interface AdminStatsProps {
  usuariosTotales: number | string
  programasActivos: number | string
  loading: boolean
}

export function AdminStats({ usuariosTotales, programasActivos, loading }: AdminStatsProps) {
  const stats = [
    { title: "Usuarios", value: usuariosTotales, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Programas", value: programasActivos, icon: Building2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((s, i) => (
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
    </div>
  )
}
