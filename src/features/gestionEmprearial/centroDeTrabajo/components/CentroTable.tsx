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
  MapPin,
  Calendar,
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
  DropdownMenuLabel,
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
  <div className="rounded-lg border overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="font-semibold">Nombre del Centro</TableHead>
          <TableHead className="font-semibold">Ubicación</TableHead>
          <TableHead className="font-semibold">Teléfono</TableHead>
          <TableHead className="font-semibold">Email</TableHead>
          <TableHead className="font-semibold text-center">Restricción Edad</TableHead>
          <TableHead className="font-semibold">Estado</TableHead>
          <TableHead className="font-semibold">Validado</TableHead>
          <TableHead className="font-semibold">Fecha</TableHead>
          <TableHead className="font-semibold text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {centros.map((centro) => (
          <TableRow key={centro.id} className="hover:bg-muted/30">
            <TableCell>
              <div className="space-y-1">
                <p className="font-medium">{centro.name}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{centro.location}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">{centro.telefono || "—"}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{centro.email || "—"}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className={`text-sm font-medium ${centro.restriccion_edad ? 'text-amber-600' : 'text-emerald-600'}`}>
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
              <div className="flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {(() => {
                  try {
                    const date = new Date(centro.createdAt);
                    if (isNaN(date.getTime())) return centro.createdAt;
                    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onView(centro)}>
                    <Eye className="h-4 w-4 mr-2" /> Ver Detalles
                  </DropdownMenuItem>
                  {centro.status !== 'inactivo' && onEdit && !isReadOnly && (
                    <DropdownMenuItem onClick={() => onEdit(centro)}>
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                  )}
                  {centro.status === 'inactivo' && !isReadOnly ? (
                    <>
                      {onRestore && (
                        <DropdownMenuItem onClick={() => onRestore(centro)} className="text-emerald-600">
                          <RotateCcw className="h-4 w-4 mr-2" /> Restaurar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {onDelete && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(centro.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar Definitivamente
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
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
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
