import { Search, Filter } from "lucide-react";
import { Input } from "../../../../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import type { AsistenciaFilters } from "../types";

interface AsistenciasFiltersProps {
  filters: AsistenciaFilters;
  onFiltersChange: (filters: AsistenciaFilters) => void;
}

export const AsistenciasFilters = ({
  filters,
  onFiltersChange
}: AsistenciasFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar estudiante o empresa..."
          value={filters.searchTerm}
          onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
        />
      </div>

      <Select
        value={filters.filterAsistencia}
        onValueChange={(val: AsistenciaFilters['filterAsistencia']) =>
          onFiltersChange({ ...filters, filterAsistencia: val })
        }
      >
        <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="h-4 w-4 text-primary shrink-0" />
            <div className="truncate text-left">
              <SelectValue placeholder="Asistencia" />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-2">
          <SelectItem value="all" className="text-xs font-bold">Todos</SelectItem>
          <SelectItem value="presente" className="text-xs font-bold">Presente</SelectItem>
          <SelectItem value="ausente" className="text-xs font-bold">Ausente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
