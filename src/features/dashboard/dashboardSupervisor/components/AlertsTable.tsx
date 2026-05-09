import { ShieldCheck, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shared/components/ui/card"
import { Badge } from "../../../../shared/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../shared/components/ui/table"

interface Alerta {
  id: string | number
  nombre: string
  taller: string
  tipo_alerta: string
  valor: string
}

interface AlertsTableProps {
  alertas: Alerta[]
  loading: boolean
}

export function AlertsTable({ alertas, loading }: AlertsTableProps) {
  return (
    <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-red-500" />
              Alertas de Seguimiento Académico
            </CardTitle>
            <CardDescription className="text-xs">Estudiantes detectados con anomalías de rendimiento o asistencia.</CardDescription>
          </div>
          <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-100 font-bold">
            {loading ? "—" : `${alertas.length} Alertas`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
            <span className="text-sm font-medium">Sincronizando alertas...</span>
          </div>
        ) : alertas.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm font-medium bg-muted/5 italic">
            No se detectaron anomalías en el periodo actual.
          </div>
        ) : (
          <div className="rounded-b-2xl overflow-hidden w-full">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 px-4">Estudiante</TableHead>
                  <TableHead className="h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 hidden sm:table-cell">Taller</TableHead>
                  <TableHead className="h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 text-center">Alerta</TableHead>
                  <TableHead className="h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 text-right px-4">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertas.map((alerta) => (
                  <TableRow key={alerta.id} className="group hover:bg-muted/30 transition-colors border-b last:border-0">
                    <TableCell className="px-4 py-4 max-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-500/20 shadow-sm group-hover:scale-105 transition-transform">
                          {alerta.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {alerta.nombre}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[150px]">
                        {alerta.taller}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border-none shadow-none bg-rose-100 text-rose-700 whitespace-nowrap">
                        {alerta.tipo_alerta}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-4">
                      <span className="text-sm font-black text-foreground whitespace-nowrap">{alerta.valor}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
