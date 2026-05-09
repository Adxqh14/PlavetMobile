import { Link } from "react-router-dom"
import { ClipboardCheck, AlertCircle, Building2, ArrowRight } from "lucide-react"
import { Card } from "../../../../shared/components/ui/card"

interface BusinessActionsProps {
  empresa?: string
  loading: boolean
}

export function BusinessActions({ empresa, loading }: BusinessActionsProps) {
  const actions = [
    { title: "Evaluaciones Técnicas", icon: ClipboardCheck, href: "/evaluaciones", desc: "Evaluar desempeño", color: "text-primary" },
    { title: "Gestión de Excusas", icon: AlertCircle, href: "/excusas", desc: "Validar incidencias", color: "text-amber-600" },
    { title: "Centro de Trabajo", icon: Building2, value: empresa ?? "...", color: "text-emerald-600", bg: "bg-emerald-500/10" },
  ]

  return (
    <>
      {actions.map((action, i) => (
        action.href ? (
          <Link key={i} to={action.href} className="group flex items-center gap-4 p-6 rounded-2xl bg-card border hover:border-primary/30 hover:shadow-md transition-all h-full">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <action.icon className={`h-5 w-5 ${action.color} group-hover:text-white`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{action.title}</p>
              <p className="text-[10px] text-muted-foreground font-bold">{action.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </Link>
        ) : (
          <Card key={i} className="border border-border bg-card shadow-sm rounded-2xl h-full flex flex-col justify-center px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{action.title}</p>
                <p className="text-sm font-black text-foreground truncate">{loading ? "..." : action.value}</p>
              </div>
            </div>
          </Card>
        )
      ))}
    </>
  )
}
