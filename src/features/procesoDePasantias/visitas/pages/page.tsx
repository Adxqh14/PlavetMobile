"use client"

import { useState, lazy, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Main from "@/features/main/pages/page"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useVisitas } from "../hooks/useVisitas"
import type { Visita, VisitaFormData } from "../types"

const VisitasTable = lazy(() =>
  import("../components/VisitasTable").then((m) => ({ default: m.VisitasTable }))
)
const VisitaFormDialog = lazy(() =>
  import("../components/VisitaFormDialog").then((m) => ({ default: m.VisitaFormDialog }))
)
const VisitaDetailsDialog = lazy(() =>
  import("../components/VisitaDetailsDialog").then((m) => ({ default: m.VisitaDetailsDialog }))
)

const ESTADOS = [
  { value: "all", label: "Todos los estados" },
  { value: "programada", label: "Programada" },
  { value: "realizada", label: "Realizada" },
  { value: "reprogramada", label: "Reprogramada" },
  { value: "cancelada", label: "Cancelada" },
]

const canCreate = (role: string | null) =>
  role === "ADMINISTRADOR" || role === "TUTOR ACADEMICO" || role === "VINCULADOR"

export default function VisitasPage() {
  const { userRole, user } = useAuth()
  const { visitas, isLoading, error, filters, setFilters, addVisita } = useVisitas()

  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleView = (v: Visita) => {
    setSelectedVisita(v)
    setIsDetailsOpen(true)
  }

  const handleFormSubmit = async (data: VisitaFormData) => {
    await addVisita(data)
  }

  const handleExport = () => {
    const csvContent = [
      ["ID", "Empresa", "Tutor", "Motivo", "Fecha", "Hora", "Estado", "Estudiantes"],
      ...visitas.map((v) => [
        v.id,
        v.centro_trabajo?.nombre ?? "",
        v.tutor ? `${v.tutor.nombre} ${v.tutor.apellido}` : "",
        v.motivo,
        String(v.fecha).slice(0, 10),
        String(v.hora ?? "").slice(0, 5),
        v.estado,
        (v.estudiantes ?? []).map((e) => `${e.estudiante.nombre} ${e.estudiante.apellido}`).join("; "),
      ]),
    ]
      .map((row) => row.map((c) => `"${c}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `visitas_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Auto-fill tutor from logged-in user if TUTOR ACADEMICO
  const defaultTutorId = userRole === "TUTOR ACADEMICO" ? (user?.id ?? "") : ""
  const defaultTutorName =
    userRole === "TUTOR ACADEMICO" && user
      ? `${(user as any).nombre ?? ""} ${(user as any).apellido ?? ""}`.trim()
      : ""

  return (
    <Main>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Registro de Visitas</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Programación y seguimiento de visitas de supervisión a centros de trabajo
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Visitas Programadas</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" /> Exportar
                </Button>
                {canCreate(userRole) && (
                  <Button size="sm" onClick={() => setIsFormOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Programar Visita
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por empresa, tutor o motivo..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>
              <Select
                value={filters.filterEstado}
                onValueChange={(v) => setFilters({ ...filters, filterEstado: v })}
              >
                <SelectTrigger className="w-full md:w-52">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Cargando visitas...
              </div>
            ) : (
              <div className="min-h-[300px]">
                <Suspense
                  fallback={
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">
                      Cargando tabla...
                    </div>
                  }
                >
                  <VisitasTable data={visitas} onView={handleView} />
                </Suspense>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <Suspense fallback={null}>
          <VisitaDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            visita={selectedVisita}
          />

          {canCreate(userRole) && (
            <VisitaFormDialog
              key={isFormOpen ? "open" : "closed"}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleFormSubmit}
              defaultTutorId={defaultTutorId}
              defaultTutorName={defaultTutorName}
            />
          )}
        </Suspense>
      </div>
    </Main>
  )
}
