import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { TableCell, TableRow } from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";
import {
  Building2,
  Calendar,
  User as UserIcon,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Layers,
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
    <TableCell className="py-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Layers className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="font-bold text-foreground truncate max-w-[200px]" title={plaza.nombre}>
            {plaza.nombre}
          </div>
          {plaza.descripcion && (
            <p className="text-[10px] text-muted-foreground truncate max-w-[180px]" title={plaza.descripcion}>
              {plaza.descripcion}
            </p>
          )}
        </div>
      </div>
    </TableCell>
    <TableCell className="py-4">
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <Building2 className="h-4 w-4 shrink-0 text-primary/60" /> 
        <span className="text-sm truncate max-w-[180px]" title={plaza.centro}>{plaza.centro}</span>
      </div>
    </TableCell>
    <TableCell className="py-4">
      <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
        <UserIcon className="h-3.5 w-3.5 shrink-0" />{" "}
        <span className="text-sm">{plaza.genero}</span>
      </div>
    </TableCell>
    <TableCell className="py-4">
      <Badge
        className={`${statusStyles[plaza.estado] || ""} border-none shadow-none font-bold text-[10px] uppercase tracking-wider`}
      >
        {plaza.estado}
      </Badge>
    </TableCell>
    <TableCell className="py-4">
      <div className="flex items-center gap-1.5">
        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
          {plaza.cupoTotal}
        </span>
      </div>
    </TableCell>
    <TableCell className="py-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
        <Calendar className="h-3.5 w-3.5 text-primary/40" />{" "}
        {plaza.fechaCreacion}
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
            onClick={() => onView(plaza)}
            className="rounded-lg font-bold text-xs cursor-pointer py-2 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" /> Ver Detalles
          </DropdownMenuItem>
          {onEdit && !isReadOnly && plaza.estado !== 'Inhabilitada' && (
            <DropdownMenuItem 
              onClick={() => onEdit(plaza)}
              className="rounded-lg font-bold text-xs cursor-pointer py-2 hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" /> Editar Plaza
            </DropdownMenuItem>
          )}
          {plaza.estado === 'Inhabilitada' && !isReadOnly ? (
            <>
              {onRestore && (
                <DropdownMenuItem 
                  onClick={() => onRestore(plaza)} 
                  className="rounded-lg font-bold text-xs cursor-pointer py-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Restaurar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="my-1" />
              {onDelete && (
                <DropdownMenuItem
                  className="rounded-lg font-bold text-xs cursor-pointer py-2 text-destructive hover:bg-destructive/5 transition-colors"
                  onClick={() => onDelete(plaza.id)}
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
                  onClick={() => onDelete(plaza.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Inhabilitar
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
