import { Search, Upload } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Button } from "@/shared/components/ui/button"
import type { ChangeEvent } from "react"
import type { DocumentStatus } from "../../types"

interface MisDocumentosFiltersProps {
  filters: { searchTerm: string; statusFilter: DocumentStatus | "all" }
  isLoading: boolean
  onFiltersChange: (filters: Partial<{ searchTerm: string; statusFilter: DocumentStatus | "all" }>) => void
  onUploadClick: () => void
}

export function MisDocumentosFilters({ filters, isLoading, onFiltersChange, onUploadClick }: MisDocumentosFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar documento..."
          value={filters.searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFiltersChange({ searchTerm: e.target.value })}
          className="pl-10"
        />
      </div>

      <Select
        value={filters.statusFilter}
        onValueChange={(value: string) => onFiltersChange({ statusFilter: value as DocumentStatus | "all" })}
      >
        <SelectTrigger className="w-full lg:w-40">
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="Pendiente">Pendiente</SelectItem>
          <SelectItem value="Validado">Validado</SelectItem>
          <SelectItem value="Rechazado">Rechazado</SelectItem>
        </SelectContent>
      </Select>

      <Button
        className="w-full lg:w-auto gap-2"
        onClick={onUploadClick}
        disabled={isLoading}
      >
        <Upload className="h-4 w-4" />
        Subir Documentos
      </Button>
    </div>
  )
}
