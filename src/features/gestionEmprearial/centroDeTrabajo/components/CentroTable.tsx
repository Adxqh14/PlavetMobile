"use client";

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
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Building2,
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
  <div className="rounded-xl border overflow-x-auto bg-background max-w-full">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="font-semibold py-4">Nombre del Centro</TableHead>

          <TableHead className="font-semibold py-4">Teléfono</TableHead>
          <TableHead className="font-semibold py-4">Email</TableHead>
          <TableHead className="font-semibold py-4 text-center">Restricción Edad</TableHead>
          <TableHead className="font-semibold py-4">Estado</TableHead>
          <TableHead className="font-semibold py-4">Validado</TableHead>
          <TableHead className="font-semibold py-4">Fecha</TableHead>
          <TableHead className="font-semibold py-4 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {centros.map((centro) => (
          <TableRow key={centro.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="font-bold text-foreground truncate max-w-[220px]" title={centro.name}>
                  {centro.name}
                </div>
              </div>
            </TableCell>

            <TableCell className="py-4">
              <span className="text-sm font-medium text-muted-foreground">{centro.telefono || "—"}</span>
            </TableCell>
            <TableCell className="py-4">
              <span className="text-sm font-medium text-muted-foreground truncate max-w-[180px]" title={centro.email}>
                {centro.email || "—"}
              </span>
            </TableCell>
            <TableCell className="text-center py-4">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${centro.restriccion_edad ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {centro.restriccion_edad ? "Sí" : "No"}
              </span>
            </TableCell>
            <TableCell className="py-4">
              <Badge
                className={`${statusStyles[centro.status] || ""} border-none shadow-none font-bold text-[10px] uppercase tracking-wider`}
              >
                {statusLabels[centro.status] || centro.status}
              </Badge>
            </TableCell>
            <TableCell className="py-4">
              <Badge
                className={centro.validated 
                  ? "bg-blue-100 text-blue-700 border-none shadow-none font-bold text-[10px] uppercase tracking-wider" 
                  : "bg-gray-100 text-gray-700 border-none shadow-none font-bold text-[10px] uppercase tracking-wider"
                }
              >
                {centro.validated ? "Validado" : "No Validado"}
              </Badge>
            </TableCell>
            <TableCell className="py-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                <Calendar className="h-3.5 w-3.5 text-primary/40" />
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
            <TableCell className="text-right py-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-2 shadow-xl p-1.5 min-w-[160px]">
                  <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5">
                    Operaciones
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem 
                    onClick={() => onView(centro)}
                    className="rounded-lg font-bold text-xs cursor-pointer py-2 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" /> Ver Detalles
                  </DropdownMenuItem>
                  
                  {!isReadOnly && centro.status !== 'inactivo' && onEdit && (
                    <DropdownMenuItem 
                      onClick={() => onEdit(centro)}
                      className="rounded-lg font-bold text-xs cursor-pointer py-2 hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Editar Centro
                    </DropdownMenuItem>
                  )}

                  {centro.status === 'inactivo' && !isReadOnly ? (
                    <>
                      {onRestore && (
                        <DropdownMenuItem 
                          onClick={() => onRestore(centro)} 
                          className="rounded-lg font-bold text-xs cursor-pointer py-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" /> Restaurar
                         </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="my-1" />
                      {onDelete && (
                        <DropdownMenuItem
                          className="rounded-lg font-bold text-xs cursor-pointer py-2 text-destructive hover:bg-destructive/5 transition-colors"
                          onClick={() => onDelete(centro.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar Permanente
                        </DropdownMenuItem>
                      )}
                    </>
                  ) : (
                    !isReadOnly && onDelete && (
                      <>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem
                          className="rounded-lg font-bold text-xs cursor-pointer py-2 text-destructive hover:bg-destructive/5 transition-colors"
                          onClick={() => onDelete(centro.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar Centro
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
