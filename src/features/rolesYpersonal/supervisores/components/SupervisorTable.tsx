import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../shared/components/ui/table";
import { Button } from "../../../../shared/components/ui/button";
import { Badge } from "../../../../shared/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import type { Supervisor } from "../types";

interface SupervisorTableProps {
  supervisores: Supervisor[];
  onView: (supervisor: Supervisor) => void;
  onEdit?: (supervisor: Supervisor) => void;
  onDelete?: (id: string) => void;
  onRestore?: (supervisor: Supervisor) => void;
}

const estadoStyles: Record<string, string> = {
  Activo: "bg-emerald-100 text-emerald-700",
  activo: "bg-emerald-100 text-emerald-700",
  Inactivo: "bg-gray-100 text-gray-700",
  inactivo: "bg-gray-100 text-gray-700",
};

export function SupervisorTable({
  supervisores,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: SupervisorTableProps) {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold py-4">Supervisor</TableHead>
            <TableHead className="font-semibold py-4">Cédula</TableHead>
            <TableHead className="font-semibold py-4">Contacto</TableHead>
            <TableHead className="font-semibold py-4">Estado</TableHead>
            <TableHead className="font-semibold py-4 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supervisores.map((supervisor) => {
            const isDeleted = !!supervisor.deleted_at;
            return (
              <TableRow key={supervisor.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="font-medium text-foreground">
                    {supervisor.nombre} {supervisor.apellido}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-muted-foreground">{supervisor.cedula}</span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{supervisor.email}</p>
                    <p className="text-xs text-muted-foreground">{supervisor.telefono || "—"}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${estadoStyles[supervisor.estado] || ""} border-none shadow-none`}
                  >
                    {isDeleted ? "Eliminado" : supervisor.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onView(supervisor)}>
                        <Eye className="mr-2 h-4 w-4" /> Ver detalles
                      </DropdownMenuItem>
                      {!isDeleted && onEdit && !isReadOnly && (
                        <DropdownMenuItem onClick={() => onEdit(supervisor)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                      )}
                      {!isReadOnly && (
                        <>
                          <DropdownMenuSeparator />
                          {isDeleted ? (
                            onRestore && (
                              <DropdownMenuItem
                                onClick={() => onRestore(supervisor)}
                                className="text-emerald-600"
                              >
                                <RotateCcw className="mr-2 h-4 w-4" /> Restaurar
                              </DropdownMenuItem>
                            )
                          ) : (
                            onDelete && (
                              <DropdownMenuItem
                                onClick={() => onDelete(supervisor.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                              </DropdownMenuItem>
                            )
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
