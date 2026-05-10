"use client"

import { useState, lazy, Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import Main from "@/features/main/pages/page"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useVisitas } from "../hooks/useVisitas"
import type { Visita } from "../types"
import { VisitasHero } from "../components/VisitasHero"
import { VisitasActionBar } from "../components/VisitasActionBar"
import { VisitasFilters } from "../components/VisitasFilters"

const VisitasTable = lazy(() =>
  import("../components/VisitasTable").then((m) => ({ default: m.VisitasTable }))
)
const VisitaFormDialog = lazy(() =>
  import("../components/VisitaFormDialog").then((m) => ({ default: m.VisitaFormDialog }))
)
const VisitaDetailsDialog = lazy(() =>
  import("../components/VisitaDetailsDialog").then((m) => ({ default: m.VisitaDetailsDialog }))
)

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
        <VisitasHero userRole={userRole} userTaller={user?.taller} />

        <div className="w-full pb-12 px-6 md:px-12">
          <VisitasActionBar 
            onExport={handleExport}
            canCreate={canCreate(userRole)}
            onOpenForm={() => setIsFormOpen(true)}
          />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <VisitasFilters 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </CardHeader>

            <CardContent className="p-6">
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
              onSubmit={addVisita}
              defaultTutorId={defaultTutorId}
              defaultTutorName={defaultTutorName}
            />
          )}
        </Suspense>
      </div>
    </Main>
  )
}
