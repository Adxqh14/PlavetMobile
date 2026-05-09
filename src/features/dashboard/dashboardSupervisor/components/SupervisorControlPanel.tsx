import { Link } from "react-router-dom"
import { FileText, Building2, Briefcase, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/card"
import { Button } from "../../../../shared/components/ui/button"

export function SupervisorControlPanel() {
  const actions = [
    { title: "Reportes Consolidados", icon: FileText, href: "/reportes", color: "text-primary" },
    { title: "Centros de Trabajo", icon: Building2, href: "/centroDeTrabajo", color: "text-emerald-600" },
    { title: "Gestión de Pasantías", icon: Briefcase, href: "/gestionDePasantias", color: "text-indigo-600" }
  ]

  return (
    <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-border/50 pb-3">
        <CardTitle className="text-sm font-bold text-foreground uppercase tracking-widest">Panel de Control</CardTitle>
      </CardHeader>
      <CardContent className="p-3 grid gap-2 flex-1">
        {actions.map((action, i) => (
          <Button key={i} variant="ghost" className="w-full justify-start font-medium text-sm h-14 px-3 hover:bg-muted group rounded-xl border border-transparent hover:border-border/50 transition-all" asChild>
            <Link to={action.href}>
              <div className="p-2 rounded-lg mr-3 bg-background border border-border group-hover:border-primary/30 shadow-xs transition-colors">
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span className="flex-1 text-left text-sm font-semibold">{action.title}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
