"use client"

import { useState, lazy, Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
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
  User,
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
      ? `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim()
      : ""

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <CalendarDays className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Supervisión de <span className="text-primary">Visitas</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Programación y seguimiento presencial en los centros de trabajo para garantizar la calidad formativa del programa.
              </p>
              {userRole === "TUTOR ACADEMICO" && user?.taller && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary border border-primary/20">
                  <User className="h-4 w-4" />
                  <span>Taller: {user.taller.nombre}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Registro de Visitas</h2>
              <p className="text-muted-foreground font-medium text-sm">Control cronológico de supervisiones externas</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted">
                <Download className="h-4 w-4 mr-2" /> Exportar CSV
              </Button>
              {canCreate(userRole) && (
                <Button size="sm" onClick={() => setIsFormOpen(true)} className="rounded-xl font-bold h-10 text-xs shadow-md shadow-primary/20">
                  <Plus className="h-4 w-4 mr-2" /> Programar Visita
                </Button>
              )}
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por empresa, tutor o motivo..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>
                <Select
                  value={filters.filterEstado}
                  onValueChange={(v) => setFilters({ ...filters, filterEstado: v })}
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
            </CardHeader>

            <CardContent className="p-6">
              {/* Results Summary */}
              {!isLoading && visitas.length > 0 && (
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  Mostrando {visitas.length} de {visitas.length} registros
                  <span className="mx-2 opacity-30">|</span>
                  Página 1 de 1
                </p>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando visitas...</p>
                </div>
              ) : (
                <div className="min-h-[300px]">
                  <Suspense
                    fallback={
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse font-bold">
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
        </div>

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
