import { Search, FileText, GraduationCap } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { type DocumentStatus } from "../types"
import { useAuth } from "@/features/auth/hooks/useAuth"

interface DocumentationFiltersProps {
  searchTerm: string
  statusFilter: string
  selectedTaller: string
  talleres: { id: string; nombre: string }[]
  onFiltersChange: (filters: { searchTerm?: string; statusFilter?: DocumentStatus | "all" }) => void
  onTallerChange: (tallerId: string) => void
}

export function DocumentationFilters({
  searchTerm,
  statusFilter,
  selectedTaller,
  talleres,
  onFiltersChange,
  onTallerChange
}: DocumentationFiltersProps) {
  const { userRole } = useAuth()

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar estudiante..."
          value={searchTerm}
          onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
          className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
        />
      </div>

      <div className="flex gap-3">
        {/* Estado filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => onFiltersChange({ statusFilter: value as DocumentStatus | "all" })}
        >
          <SelectTrigger className="w-full md:w-44 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <div className="truncate text-left">
                <SelectValue placeholder="Estado" />
              </div>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-2">
            <SelectItem value="all" className="text-xs font-bold">Todos los estados</SelectItem>
            <SelectItem value="Pendiente" className="text-xs font-bold">Pendiente</SelectItem>
            <SelectItem value="Validado" className="text-xs font-bold">Validado</SelectItem>
            <SelectItem value="Rechazado" className="text-xs font-bold">Rechazado</SelectItem>
          </SelectContent>
        </Select>

        {/* Taller filter — only for non-student roles */}
        {userRole !== "ESTUDIANTE" && talleres.length > 0 && (
          <Select value={selectedTaller} onValueChange={onTallerChange}>
            <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
              <div className="flex items-center gap-2 min-w-0">
                <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                <div className="truncate text-left">
                  <SelectValue placeholder="Taller" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2">
              <SelectItem value="all" className="text-xs font-bold">Todos los talleres</SelectItem>
              {talleres.map(t => (
                <SelectItem key={t.id} value={t.id} className="text-xs font-bold">{t.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
