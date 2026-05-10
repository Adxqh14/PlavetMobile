import { Search, Filter } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { VisitaFilters } from "../types";

const ESTADOS = [
  { value: "all", label: "Todos los estados" },
  { value: "programada", label: "Programada" },
  { value: "realizada", label: "Realizada" },
  { value: "reprogramada", label: "Reprogramada" },
  { value: "cancelada", label: "Cancelada" },
];

interface VisitasFiltersProps {
  filters: VisitaFilters;
  onFiltersChange: (filters: VisitaFilters) => void;
}

export const VisitasFilters = ({
  filters,
  onFiltersChange
}: VisitasFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por empresa, tutor o motivo..."
          value={filters.searchTerm}
          onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
        />
      </div>
      <Select
        value={filters.filterEstado}
        onValueChange={(v) => onFiltersChange({ ...filters, filterEstado: v })}
      >
        <SelectTrigger className="w-full md:w-52 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="h-4 w-4 text-primary shrink-0" />
            <div className="truncate text-left">
              <SelectValue placeholder="Estado" />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-2">
          {ESTADOS.map((e) => (
            <SelectItem key={e.value} value={e.value} className="text-xs font-bold">
              {e.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
