import { Link } from "react-router-dom"
import { Users, ClipboardCheck, FileText, Calendar, ArrowRight } from "lucide-react"

export function AcademicActions() {
  const actions = [
    { title: "Gestión Académica", icon: Users, href: "/estudiantes", desc: "Listado", color: "text-primary" },
    { title: "Revisar Excusas", icon: ClipboardCheck, href: "/excusas", desc: "Inasistencias", color: "text-amber-600" },
    { title: "Mis Reportes", icon: FileText, href: "/reportes", desc: "Analítica", color: "text-indigo-600" },
    { title: "Calendario Visitas", icon: Calendar, href: "/visitas", desc: "Visitas", color: "text-emerald-600" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, i) => (
        <Link key={i} to={action.href} className="group flex items-center gap-4 p-5 rounded-2xl bg-card border hover:border-primary/30 hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:border-primary transition-all">
            <action.icon className={`h-5 w-5 ${action.color} group-hover:text-white transition-colors`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{action.title}</p>
            <p className="text-[11px] text-muted-foreground font-bold">{action.desc}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </Link>
      ))}
    </div>
  )
}
