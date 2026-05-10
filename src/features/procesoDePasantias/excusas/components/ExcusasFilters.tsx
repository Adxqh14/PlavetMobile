import { Search, Filter } from "lucide-react";
import { Input } from "../../../../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import type { ExcuseFilters } from "../types";

interface ExcusasFiltersProps {
  filters: ExcuseFilters;
  onFiltersChange: (filters: Partial<ExcuseFilters>) => void;
  userRole?: string | null;
}

export const ExcusasFilters = ({
  filters,
  onFiltersChange,
  userRole
}: ExcusasFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={userRole === "ESTUDIANTE" ? "Buscar en mis excusas..." : "Buscar por estudiante, ID o justificación..."}
          value={filters.searchTerm}
          onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
          className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
        />
      </div>

      <Select
        value={filters.filterEstado}
        onValueChange={(val: string) => onFiltersChange({ filterEstado: val })}
      >
        <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="h-4 w-4 text-primary shrink-0" />
            <div className="truncate text-left">
              <SelectValue placeholder="Estado" />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-2">
          <SelectItem value="all" className="text-xs font-bold">Todos los estados</SelectItem>
          <SelectItem value="Pendiente" className="text-xs font-bold">Pendiente</SelectItem>
          <SelectItem value="Aprobada" className="text-xs font-bold">Aprobada</SelectItem>
          <SelectItem value="Rechazada" className="text-xs font-bold">Rechazada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
