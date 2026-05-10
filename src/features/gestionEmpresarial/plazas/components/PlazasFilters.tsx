import { Search, Filter } from "lucide-react";
import { Input } from "../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";

interface PlazasFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterEstado: string;
  onFilterChange: (value: string) => void;
}

export function PlazasFilters({
  searchTerm,
  onSearchChange,
  filterEstado,
  onFilterChange,
}: PlazasFiltersProps) {
  return (
    <div id="tour-plazas-filters" className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, centro o taller..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
        />
      </div>

      <div className="flex gap-3">
        <Select value={filterEstado} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <SelectValue placeholder="Estado" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-2">
            <SelectItem value="todos" className="text-xs font-bold">Todos los estados</SelectItem>
            <SelectItem value="activa" className="text-xs font-bold">Activa</SelectItem>
            <SelectItem value="completa" className="text-xs font-bold">Completa</SelectItem>
            <SelectItem value="inactiva" className="text-xs font-bold">Inactiva</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
