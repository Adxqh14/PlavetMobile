import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import type { CentroTrabajo } from "../types";

interface Props {
  centros: CentroTrabajo[];
  onView: (centro: CentroTrabajo) => void;
  onEdit?: (centro: CentroTrabajo) => void;
  onDelete?: (id: string) => void;
  onRestore?: (centro: CentroTrabajo) => void;
}

const statusStyles: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-amber-100 text-amber-700",
  rechazado: "bg-rose-100 text-rose-700",
  inactivo: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  activo: "Activo",
  pendiente: "Pendiente",
  rechazado: "Rechazado",
  inactivo: "Inactivo",
};

export const CentroTable = ({ centros, onView, onEdit, onDelete, onRestore }: Props) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);
  
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Nombre del Centro</TableHead>
            <TableHead className="font-semibold">Contacto</TableHead>
            <TableHead className="font-semibold text-center">Restricción Edad</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">Validación</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {centros.map((centro) => (
            <TableRow key={centro.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <div className="font-medium text-foreground truncate max-w-[220px]" title={centro.name}>
                  {centro.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{centro.email || "—"}</p>
                  <p className="text-xs text-muted-foreground">{centro.telefono || "—"}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${centro.restriccion_edad ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {centro.restriccion_edad ? "Sí" : "No"}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  className={`${statusStyles[centro.status] || ""} border-none shadow-none`}
                >
                  {statusLabels[centro.status] || centro.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={centro.validated 
                    ? "bg-blue-100 text-blue-700 border-none shadow-none" 
                    : "bg-gray-100 text-gray-700 border-none shadow-none"
                  }
                >
                  {centro.validated ? "Validado" : "No Validado"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {(() => {
                    try {
                      const date = new Date(centro.createdAt);
                      if (isNaN(date.getTime())) return centro.createdAt;
                      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                    } catch {
                      return centro.createdAt;
                    }
                  })()}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView(centro)}>
                      <Eye className="mr-2 h-4 w-4" /> Ver detalles
                    </DropdownMenuItem>
                    {!isReadOnly && centro.status !== 'inactivo' && onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(centro)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                    )}
                    {centro.status === 'inactivo' && !isReadOnly ? (
                      <>
                        {onRestore && (
                          <DropdownMenuItem onClick={() => onRestore(centro)} className="text-emerald-600">
                            <RotateCcw className="mr-2 h-4 w-4" /> Restaurar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(centro.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar Permanente
                          </DropdownMenuItem>
                        )}
                      </>
                    ) : (
                      !isReadOnly && onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(centro.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
