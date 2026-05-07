import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { Visita } from "../types";

interface Props {
  data: Visita[];
  onView: (visita: Visita) => void;
}

const estadoStyles: Record<string, string> = {
  programada: "bg-amber-100 text-amber-700",
  realizada: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-red-100 text-red-700",
  reprogramada: "bg-blue-100 text-blue-700",
};

const estadoLabel: Record<string, string> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
  reprogramada: "Reprogramada",
};

const formatTime = (t: string | null | undefined) =>
  t ? String(t).slice(0, 5) : "—";

const formatDate = (d: string | null | undefined) =>
  d ? String(d).slice(0, 10) : "—";

export const VisitasTable = ({ data, onView }: Props) => {
  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold py-4 pl-6">Empresa</TableHead>
            <TableHead className="font-semibold py-4">Tutor</TableHead>
            <TableHead className="font-semibold py-4">Motivo</TableHead>
            <TableHead className="font-semibold py-4">Fecha</TableHead>
            <TableHead className="font-semibold py-4">Hora</TableHead>
            <TableHead className="font-semibold py-4">Estudiantes</TableHead>
            <TableHead className="font-semibold py-4">Estado</TableHead>
            <TableHead className="font-semibold py-4 text-right pr-6">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((v) => (
              <TableRow key={v.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="pl-6 py-4">
                  <div className="font-medium text-foreground">{v.centro_trabajo?.nombre ?? "—"}</div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm text-muted-foreground">
                    {v.tutor ? `${v.tutor.nombre} ${v.tutor.apellido}` : "—"}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm text-muted-foreground truncate max-w-[180px]" title={v.motivo}>
                    {v.motivo}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm text-muted-foreground tabular-nums">{formatDate(v.fecha)}</div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm text-muted-foreground tabular-nums">{formatTime(v.hora)}</div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm text-muted-foreground">
                    {v.estudiantes?.length ?? 0} {v.estudiantes?.length === 1 ? 'estudiante' : 'estudiantes'}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge className={`${estadoStyles[v.estado] ?? "bg-muted text-muted-foreground"} border-none shadow-none`}>
                    {estadoLabel[v.estado] ?? v.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onView(v)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                No se encontraron visitas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
