import { Search, Filter } from "lucide-react";
import { Input } from "../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";

interface VinculadoresFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onFilterChange: (val: string) => void;
}

export const VinculadoresFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onFilterChange
}: VinculadoresFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, cédula o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
        />
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <SelectValue placeholder="Estado" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-2">
            <SelectItem value="todos" className="text-xs font-bold">Todos los estados</SelectItem>
            <SelectItem value="Activo" className="text-xs font-bold">Activo</SelectItem>
            <SelectItem value="Inactivo" className="text-xs font-bold">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
