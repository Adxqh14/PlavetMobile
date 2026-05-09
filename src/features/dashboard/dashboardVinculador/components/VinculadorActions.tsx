import { Link } from "react-router-dom"
import { Building2, Briefcase, UserPlus, FileCheck, ArrowRight } from "lucide-react"

export function VinculadorActions() {
  const sections = [
    {
      title: "Gestión Institucional",
      icon: Building2,
      items: [
        { title: "Directorio de Empresas", icon: Building2, href: "/centroDeTrabajo", desc: "Listado completo de aliados estratégicos" },
        { title: "Gestión de Pasantías", icon: Briefcase, href: "/gestionDePasantias", desc: "Asignaciones y seguimiento de estudiantes" }
      ]
    },
    {
      title: "Control Operativo",
      icon: Briefcase,
      items: [
        { title: "Asignación de Plazas", icon: UserPlus, href: "/plaza", desc: "Gestión de cupos por talleres y especialidades" },
        { title: "Cierre de Pasantías", icon: FileCheck, href: "/cierrePasantias", desc: "Finalización y validación de horas totales" },
      ]
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {sections.map((section, idx) => (
        <section key={idx} className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-primary">
            <section.icon className="h-5 w-5" />
            <h2 className="text-xl font-black text-foreground tracking-tight">{section.title}</h2>
          </div>
          <div className="grid gap-3">
            {section.items.map((item, i) => (
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
      ))}
    </div>
  )
}
