import { Link } from "react-router-dom"
import { Briefcase, GraduationCap, ClipboardCheck, History, ArrowRight } from "lucide-react"

export function AdminOperationalGrid() {
  const items = [
    { title: "Gestión de Pasantías", icon: Briefcase, href: "/gestionDePasantias", desc: "Asignaciones y seguimiento" },
    { title: "Estudiantes", icon: GraduationCap, href: "/estudiantes", desc: "Expedientes académicos" },
    { title: "Asistencias y Visitas", icon: ClipboardCheck, href: "/asistencias", desc: "Supervisión diaria" },
    { title: "Validación de Excusas", icon: History, href: "/excusas", desc: "Control de ausencias" },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1 text-primary">
        <Briefcase className="h-5 w-5" />
        <h2 className="text-xl font-black text-foreground tracking-tight">Control Operativo</h2>
      </div>
      <div className="grid gap-3">
        {items.map((item, i) => (
          <Link key={i} to={item.href} className="group flex items-center gap-4 p-5 rounded-2xl bg-card border hover:border-primary/30 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:border-primary transition-all">
              <item.icon className="h-5 w-5 text-primary group-hover:text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{item.title}</p>
              <p className="text-[11px] text-muted-foreground font-bold">{item.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </Link>
        ))}
      </div>
    </section>
  )
}
