import { Link } from "react-router-dom"
import { Building2, Building, GraduationCap, Users, ArrowRight } from "lucide-react"

export function AdminInstitutionalGrid() {
  const items = [
    { title: "Centros de Trabajo", icon: Building2, href: "/centroDeTrabajo", desc: "Empresas y sucursales aliadas" },
    { title: "Gestión de Plazas", icon: Building, href: "/plaza", desc: "Vacantes y requerimientos" },
    { title: "Tutores Académicos", icon: GraduationCap, href: "/tutoresAcademicos", desc: "Supervisores del taller" },
    { title: "Tutores Empresariales", icon: Users, href: "/tutoresEmpresariales", desc: "Supervisores en empresa" },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1 text-primary">
        <Building2 className="h-5 w-5" />
        <h2 className="text-xl font-black text-foreground tracking-tight">Estructura Institucional</h2>
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
