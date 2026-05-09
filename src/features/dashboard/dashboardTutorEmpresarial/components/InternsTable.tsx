import { Users, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"
import { Badge } from "../../../../shared/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../shared/components/ui/table"

interface Intern {
  nombre: string
  rol: string
  asistencia: string
}

interface InternsTableProps {
  equipo: Intern[]
  loading: boolean
}

export function InternsTable({ equipo, loading }: InternsTableProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1 text-primary">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-black text-foreground tracking-tight">Equipo de Pasantes</h2>
      </div>
      <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm font-bold uppercase tracking-widest">Cargando pasantes...</span>
            </div>
          ) : equipo.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
              <Users className="h-10 w-10 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest opacity-40">No hay pasantes activos</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-border/50">
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-8">Pasante</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-8">Rol Técnico</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-8 text-right">Asistencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipo.map((miembro, i) => (
                  <TableRow key={i} className="hover:bg-muted/30 transition-colors border-b border-border/50 group">
                    <TableCell className="py-5 px-8">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm bg-primary/5 text-primary border border-primary/10 transition-transform group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
                          {miembro.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors">{miembro.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-8">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{miembro.rol}</span>
                    </TableCell>
                    <TableCell className="py-5 px-8 text-right">
                      <Badge variant="outline" className="text-[10px] font-black border-emerald-500/20 bg-emerald-500/5 text-emerald-600 uppercase tracking-tighter px-3 py-1">
                        {miembro.asistencia}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
