import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { TableCell, TableRow } from "../../../../shared/components/ui/table";
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
import type { Plaza } from "../types";

interface Props {
  plaza: Plaza;
  onView: (plaza: Plaza) => void;
  onEdit?: (plaza: Plaza) => void;
  onDelete?: (id: number) => void;
  onRestore?: (plaza: Plaza) => void;
}

const statusStyles: Record<string, string> = {
  Activa: "bg-emerald-100 text-emerald-700",
  Ocupada: "bg-blue-100 text-blue-700",
  Inhabilitada: "bg-gray-100 text-gray-700",
};

export const PlazaTableRow = ({ plaza, onView, onEdit, onDelete, onRestore }: Props) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);
  
  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell>
        <div>
          <div className="font-medium text-foreground truncate max-w-[200px]" title={plaza.nombre}>
            {plaza.nombre}
          </div>
          {plaza.descripcion && (
            <p className="text-xs text-muted-foreground truncate max-w-[180px]" title={plaza.descripcion}>
              {plaza.descripcion}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground truncate max-w-[180px]" title={plaza.centro}>{plaza.centro}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{plaza.genero}</span>
      </TableCell>
      <TableCell>
        <Badge
          className={`${statusStyles[plaza.estado] || ""} border-none shadow-none`}
        >
          {plaza.estado}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {plaza.cupoTotal}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {plaza.fechaCreacion}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onView(plaza)}>
              <Eye className="mr-2 h-4 w-4" /> Ver detalles
            </DropdownMenuItem>
            {onEdit && !isReadOnly && plaza.estado !== 'Inhabilitada' && (
              <DropdownMenuItem onClick={() => onEdit(plaza)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
            )}
            {plaza.estado === 'Inhabilitada' && !isReadOnly ? (
              <>
                {onRestore && (
                  <DropdownMenuItem onClick={() => onRestore(plaza)} className="text-emerald-600">
                    <RotateCcw className="mr-2 h-4 w-4" /> Restaurar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(plaza.id)}
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
                    onClick={() => onDelete(plaza.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Inhabilitar
                  </DropdownMenuItem>
                </>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
