"use client"

import { useState, useEffect, useCallback, useMemo } from "react"

import { Button } from "../../../../shared/components/ui/button"
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import { Input } from "../../../../shared/components/ui/input"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "../../../../shared/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  User,
  Users,
  MoreHorizontal,
  Loader2,
  RefreshCw,
  Download,
  Award,
  TrendingUp,
  BookOpen,
} from "lucide-react"
import Main from "@/features/main/pages/page"
import { useCalificaciones } from "../hooks/useCalificaciones"
import { isApproved } from "../utils"
import { StatsCards, ViewCalificacionDialog } from "../components"
import { CalificacionService } from "../services/calificacionService"
import type { EvaluacionGuardada, FilterNota } from "../types"
import type { EvaluacionForm } from "../../hooks/useEvaluacion"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
  calificacionApiService,
  type CalificacionAdminItem,
} from "../../services/calificacionApiService"
import { apiClient } from "@/lib/api"

// ── Helpers admin ─────────────────────────────────────────────────────────────

// El backend mete todas las competencias bajo CAPACIDAD aunque pertenezcan a
// HABILIDAD o ACTITUD. Reclasificamos por nombre para calcular subtotales reales.
const NOMBRE_GRUPO: Record<string, "capacidad" | "habilidad" | "actitud"> = {
  "conocimientos teóricos": "capacidad",
  "conocimientos teoricos": "capacidad",
  "asimilación y seguimiento de instrucciones verbales": "capacidad",
  "asimilacion y seguimiento de instrucciones verbales": "capacidad",
  "asimilación y seguimiento de instrucciones escritas": "capacidad",
  "asimilacion y seguimiento de instrucciones escritas": "capacidad",
  "asimilación y seguimiento de instrucciones simbólicas": "capacidad",
  "asimilacion y seguimiento de instrucciones simbolicas": "capacidad",
  "organización planificación del trabajo": "habilidad",
  "organización y planificación del trabajo": "habilidad",
  "organizacion planificacion del trabajo": "habilidad",
  "organizacion y planificacion del trabajo": "habilidad",
  "método": "habilidad",
  "metodo": "habilidad",
  "ritmo de trabajo": "habilidad",
  "trabajo realizado": "habilidad",
  "iniciativa": "actitud",
  "trabajo en equipo": "actitud",
  "puntualidad y asistencia": "actitud",
  "responsabilidad": "actitud",
}

interface Subtotales { capacidad: number; habilidad: number; actitud: number }

function calcSubtotalesReales(item: CalificacionAdminItem): Subtotales {
  // Reunir todas las competencias de todos los grupos
  const all = [
    ...(item.datos?.competencias?.CAPACIDAD ?? []),
    ...(item.datos?.competencias?.HABILIDAD ?? []),
    ...(item.datos?.competencias?.ACTITUD ?? []),
  ]

  const groups: Record<"capacidad" | "habilidad" | "actitud", number[]> = {
    capacidad: [], habilidad: [], actitud: [],
  }

  for (const comp of all) {
    const grupo = NOMBRE_GRUPO[comp.nombre.toLowerCase().trim()]
    if (!grupo) continue
    // Usar el campo promedio si existe, si no calcular de semanas
    const promedio = (comp as { promedio?: number }).promedio
      ?? (comp.semanas.length > 0
        ? comp.semanas.filter((v: number) => v > 0).reduce((a: number, b: number) => a + b, 0) /
          Math.max(1, comp.semanas.filter((v: number) => v > 0).length)
        : 0)
    if (promedio > 0) groups[grupo].push(promedio)
  }

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

  return {
    capacidad: avg(groups.capacidad),
    habilidad: avg(groups.habilidad),
    actitud: avg(groups.actitud),
  }
}

function calcNotaFinal(item: CalificacionAdminItem): number {
  const s = calcSubtotalesReales(item)
  const values = [s.capacidad, s.habilidad, s.actitud].filter(v => v > 0)
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

function calcNota(item: CalificacionAdminItem): string {
  return String(Math.round(calcNotaFinal(item)))
}

function studentName(item: CalificacionAdminItem): string {
  if (item.estudiante_nombre || item.estudiante_apellido)
    return `${item.estudiante_nombre ?? ""} ${item.estudiante_apellido ?? ""}`.trim()
  const e = item.estudiante
  if (!e) return "—"
  return `${e.nombre ?? ""} ${e.apellido ?? ""}`.trim() || "—"
}

function tallerName(item: CalificacionAdminItem): string {
  return item.taller_nombre || item.estudiante?.taller?.nombre || "—"
}

// ── Vista Admin / Supervisor ──────────────────────────────────────────────────

interface TallerOption { id: string; nombre: string }

function AdminCalificacionesView() {
  const [items, setItems] = useState<CalificacionAdminItem[]>([])
  const [talleres, setTalleres] = useState<TallerOption[]>([])
  const [selectedTaller, setSelectedTaller] = useState<string>("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNota, setFilterNota] = useState<FilterNota>("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 10

  // Cargar todos los talleres de la BD (mismo método que useTalleresOptions)
  useEffect(() => {
    apiClient.get<any>("/api/v1/talleres", { pageSize: 100 })
      .then(res => {
        const items: any[] = res.data ?? []
        setTalleres(items.map((t: any) => ({ id: String(t.id), nombre: t.nombre || t.name || "" })))
      })
      .catch(() => {})
  }, [])

  const fetchCalificaciones = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await calificacionApiService.getAll()
      setItems(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar calificaciones.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchCalificaciones() }, [fetchCalificaciones])

  // Filtros cliente
  const filtered = useMemo(() => {
    let list = items

    if (selectedTaller !== "todos") {
      const tallerSeleccionado = talleres.find(t => t.id === selectedTaller)
      if (tallerSeleccionado) {
        list = list.filter(i => tallerName(i) === tallerSeleccionado.nombre)
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(i =>
        studentName(i).toLowerCase().includes(q) ||
        tallerName(i).toLowerCase().includes(q) ||
        (i.estudiante_cedula ?? "").toLowerCase().includes(q) ||
        calcNota(i).includes(q)
      )
    }

    if (filterNota !== "todos") {
      list = list.filter(i => {
        const aprobado = isApproved(calcNota(i))
        return filterNota === "aprobado" ? aprobado : !aprobado
      })
    }

    return list
  }, [items, selectedTaller, searchTerm, filterNota])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filtered, currentPage]
  )

  // Reset página cuando cambian filtros
  useEffect(() => { setCurrentPage(1) }, [selectedTaller, searchTerm, filterNota])

  // Stats
  const total = filtered.length
  const aprobados = filtered.filter(i => isApproved(calcNota(i))).length
  const reprobados = total - aprobados
  const promedioGeneral = total > 0
    ? (filtered.reduce((acc, i) => acc + calcNotaFinal(i), 0) / total).toFixed(1)
    : "0"

  const statCards = [
    { title: "Total Evaluaciones", value: total, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Promedio General", value: promedioGeneral, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Estudiantes Aprobados", value: aprobados, icon: Award, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Estudiantes Reprobados", value: reprobados, icon: BookOpen, color: "text-rose-600", bg: "bg-rose-100" },
  ]

  const handleExport = () => {
    const headers = ["Estudiante", "Cédula", "Taller", "Capacidad", "Habilidad", "Actitud", "Nota Final", "Fecha"]
    const rows = filtered.map(i => {
      const s = calcSubtotalesReales(i)
      return [
        studentName(i),
        i.estudiante_cedula || "—",
        tallerName(i),
        s.capacidad.toFixed(1),
        s.habilidad.toFixed(1),
        s.actitud.toFixed(1),
        calcNotaFinal(i).toFixed(1),
        i.fecha,
      ].map(c => `"${c}"`).join(",")
    })
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `calificaciones_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <div className="w-full pb-12 px-6 md:px-12">
      {/* Section heading */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="border-l-4 border-primary pl-6">
          <h2 className="text-3xl font-black tracking-tight">Historial de Notas</h2>
          <p className="text-muted-foreground font-medium text-sm">Todos los estudiantes — filtra por taller</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCalificaciones} disabled={isLoading}
            className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={filtered.length === 0}
            className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted">
            <Download className="h-4 w-4 mr-2" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <Card key={i} className="border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla + Filtros */}
      <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-muted/10 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por estudiante, taller, empresa o nota..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20" />
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* Filtro por taller (todos los talleres de la BD) */}
              <Select value={selectedTaller} onValueChange={v => setSelectedTaller(v)}>
                <SelectTrigger className="w-full md:w-56 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <div className="truncate text-left">
                      <SelectValue placeholder="Todos los talleres" />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="todos" className="text-xs font-bold">Todos los talleres</SelectItem>
                  {talleres.map(t => (
                    <SelectItem key={t.id} value={t.id} className="text-xs font-bold">
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro aprobado/reprobado */}
              <Select value={filterNota} onValueChange={v => setFilterNota(v as FilterNota)}>
                <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <Filter className="h-4 w-4 text-primary shrink-0" />
                    <div className="truncate text-left">
                      <SelectValue placeholder="Todas las notas" />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="todos" className="text-xs font-bold">Todas las notas</SelectItem>
                  <SelectItem value="aprobado" className="text-xs font-bold">Aprobados (≥70)</SelectItem>
                  <SelectItem value="reprobado" className="text-xs font-bold">Reprobados (&lt;70)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <GraduationCap className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-muted-foreground font-medium animate-pulse">Cargando calificaciones...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border-2 border-dashed border-destructive/30 py-16 text-center bg-destructive/5">
              <p className="text-destructive font-medium">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed py-16 text-center bg-muted/5">
              <div className="p-4 rounded-full bg-primary/5 mb-4 inline-block">
                <Search className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No se encontraron registros</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                No hay evaluaciones que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b">
                      <TableHead className="font-semibold py-4 pl-6">Estudiante / Taller</TableHead>
                      <TableHead className="font-semibold py-4">RA / Fecha</TableHead>
                      <TableHead className="font-semibold py-4 text-center">Rendimiento (C/H/A)</TableHead>
                      <TableHead className="font-semibold py-4 text-right pr-6">Nota Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map(item => {
                      const subtotales = calcSubtotalesReales(item)
                      const notaFinal = calcNotaFinal(item)
                      const nota = String(Math.round(notaFinal))
                      const notaExact = notaFinal.toFixed(1)
                      const approved = isApproved(nota)
                      const { capacidad = 0, habilidad = 0, actitud = 0 } = subtotales
                      return (
                        <TableRow key={item.id} className="hover:bg-muted/50 transition-colors border-b last:border-0">
                          <TableCell className="py-4 pl-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">{studentName(item)}</span>
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {item.estudiante_cedula || "—"}
                              </span>
                              <span className="text-[10px] text-primary/70 font-bold uppercase truncate max-w-[220px]">
                                {tallerName(item)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted-foreground font-medium">{item.ra || "—"}</span>
                              <span className="text-xs text-muted-foreground">Fecha: {item.fecha || "—"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center justify-center gap-4">
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-foreground">{Math.round(capacidad)}</span>
                                <div className="w-8 h-1 rounded-full bg-blue-500/20 overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: `${Math.min(capacidad, 100)}%` }} />
                                </div>
                                <span className="text-[7px] text-muted-foreground font-black uppercase">Cap</span>
                              </div>
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-foreground">{Math.round(habilidad)}</span>
                                <div className="w-8 h-1 rounded-full bg-purple-500/20 overflow-hidden">
                                  <div className="h-full bg-purple-500" style={{ width: `${Math.min(habilidad, 100)}%` }} />
                                </div>
                                <span className="text-[7px] text-muted-foreground font-black uppercase">Hab</span>
                              </div>
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-foreground">{Math.round(actitud)}</span>
                                <div className="w-8 h-1 rounded-full bg-green-500/20 overflow-hidden">
                                  <div className="h-full bg-green-500" style={{ width: `${Math.min(actitud, 100)}%` }} />
                                </div>
                                <span className="text-[7px] text-muted-foreground font-black uppercase">Act</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right pr-6">
                            <div className={`inline-flex flex-col items-center justify-center min-w-[70px] py-1 rounded-xl border transition-colors ${
                              approved
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100"
                                : "bg-rose-50 border-rose-200 text-rose-700 shadow-sm shadow-rose-100"
                            }`}>
                              <span className="text-xl font-black leading-none">{notaExact}</span>
                              <span className="text-[8px] font-black uppercase mt-1 opacity-80">
                                {approved ? "Aprobado" : "Reprobado"}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground font-medium">
                    Página <span className="text-foreground">{currentPage}</span> de {totalPages}
                    {" · "}{filtered.length} registros
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)}
                      disabled={currentPage === 1} className="rounded-xl font-bold h-9 text-xs">
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((p, i, arr) => (
                        <div key={p} className="flex items-center gap-1">
                          {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-muted-foreground">…</span>}
                          <Button variant={currentPage === p ? "default" : "outline"} size="sm"
                            onClick={() => setCurrentPage(p)}
                            className={`w-9 h-9 rounded-xl font-bold text-xs ${currentPage === p ? "shadow-md shadow-primary/20" : ""}`}>
                            {p}
                          </Button>
                        </div>
                      ))}
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage === totalPages} className="rounded-xl font-bold h-9 text-xs">
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Vista Tutor / otros roles (localStorage) ──────────────────────────────────

function TutorCalificacionesView() {
  const {
    paginatedEvaluaciones,
    filteredEvaluaciones,
    currentPage,
    totalPages,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filterNota,
    setFilterNota,
    filterTaller,
    setFilterTaller,
    stats,
    isLoading,
    recargarEvaluaciones
  } = useCalificaciones()

  const talleres = useMemo(() => {
    const list = CalificacionService.getEvaluaciones().map(e => e.empresa)
    return Array.from(new Set(list)).sort()
  }, [])

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<EvaluacionGuardada | null>(null)

  const handleView = (evaluacion: EvaluacionGuardada) => {
    setSelectedEvaluacion(evaluacion)
    setViewDialogOpen(true)
  }

  const handleExport = () => {
    const headers = ["Estudiante", "Empresa", "Prom. Capacidades", "Prom. Habilidades", "Prom. Actitudes", "Nota Final", "Fecha"]
    const csvContent = [
      headers.join(","),
      ...paginatedEvaluaciones.map((e: EvaluacionGuardada) =>
        [e.estudiante, e.empresa, e.promedioCapacidades, e.promedioHabilidades, e.promedioActitudes, e.notaFinal, e.fechaEvaluacion]
          .map(c => `"${c}"`).join(","))
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `calificaciones_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <div className="w-full pb-12 px-6 md:px-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="border-l-4 border-primary pl-6">
          <h2 className="text-3xl font-black tracking-tight">Historial de Notas</h2>
          <p className="text-muted-foreground font-medium text-sm">Seguimiento detallado del rendimiento estudiantil</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={recargarEvaluaciones} disabled={isLoading}
            className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={paginatedEvaluaciones.length === 0}
            className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted">
            <Download className="h-4 w-4 mr-2" /> Exportar CSV
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-muted/10 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar estudiante, empresa o nota..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={filterTaller} onValueChange={(value: string) => setFilterTaller(value)}>
                <SelectTrigger className="w-full md:w-56 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <div className="truncate text-left">
                      <SelectValue placeholder="Taller" />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="todos" className="text-xs font-bold">Todos los talleres</SelectItem>
                  {talleres.map((taller: string) => (
                    <SelectItem key={taller} value={taller} className="text-xs font-bold">{taller}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterNota} onValueChange={(value: FilterNota) => setFilterNota(value)}>
                <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <Filter className="h-4 w-4 text-primary shrink-0" />
                    <div className="truncate text-left">
                      <SelectValue placeholder="Nota" />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="todos" className="text-xs font-bold">Todas las notas</SelectItem>
                  <SelectItem value="aprobado" className="text-xs font-bold">Aprobados (≥70)</SelectItem>
                  <SelectItem value="reprobado" className="text-xs font-bold">Reprobados (&lt;70)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <GraduationCap className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-muted-foreground font-medium animate-pulse">Cargando calificaciones...</p>
            </div>
          ) : filteredEvaluaciones.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed py-16 text-center bg-muted/5">
              <div className="p-4 rounded-full bg-primary/5 mb-4 inline-block">
                <Search className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No se encontraron registros</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                No hay evaluaciones registradas que coincidan con los filtros aplicados.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b">
                      <TableHead className="font-semibold py-4 pl-6">Estudiante / Carrera</TableHead>
                      <TableHead className="font-semibold py-4">Empresa / Evaluador</TableHead>
                      <TableHead className="font-semibold py-4 text-center">Rendimiento (C/H/A)</TableHead>
                      <TableHead className="font-semibold py-4 text-right pr-6">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEvaluaciones.map((evaluacion) => {
                      const evaluacionCompleta = evaluacion.evaluacionCompleta as unknown as EvaluacionForm
                      const approved = isApproved(evaluacion.notaFinal)
                      return (
                        <TableRow key={evaluacion.id} className="hover:bg-muted/50 transition-colors border-b last:border-0">
                          <TableCell className="py-4 pl-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">{evaluacion.estudiante}</span>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase truncate max-w-[200px]">
                                {evaluacionCompleta.identidadTitulo}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">{evaluacion.empresa}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 italic font-medium">
                                <User className="w-3 h-3" /> {evaluacionCompleta.nombreTutor || "Sin asignar"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center justify-center gap-4">
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-foreground">{evaluacion.promedioCapacidades}</span>
                                <div className="w-8 h-1 rounded-full bg-blue-500/20 overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: `${evaluacion.promedioCapacidades}%` }} />
                                </div>
                                <span className="text-[7px] text-muted-foreground font-black uppercase">Cap</span>
                              </div>
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-foreground">{evaluacion.promedioHabilidades}</span>
                                <div className="w-8 h-1 rounded-full bg-purple-500/20 overflow-hidden">
                                  <div className="h-full bg-purple-500" style={{ width: `${evaluacion.promedioHabilidades}%` }} />
                                </div>
                                <span className="text-[7px] text-muted-foreground font-black uppercase">Hab</span>
                              </div>
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-foreground">{evaluacion.promedioActitudes}</span>
                                <div className="w-8 h-1 rounded-full bg-green-500/20 overflow-hidden">
                                  <div className="h-full bg-green-500" style={{ width: `${evaluacion.promedioActitudes}%` }} />
                                </div>
                                <span className="text-[7px] text-muted-foreground font-black uppercase">Act</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-3">
                              <div className={`flex flex-col items-center justify-center min-w-[70px] py-1 rounded-xl border transition-colors ${
                                approved
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100"
                                  : "bg-rose-50 border-rose-200 text-rose-700 shadow-sm shadow-rose-100"
                              }`}>
                                <span className="text-xl font-black leading-none">{evaluacion.notaFinal}</span>
                                <span className="text-[8px] font-black uppercase mt-1 opacity-80">{approved ? "Aprobado" : "Reprobado"}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted transition-colors">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleView(evaluacion)} className="font-bold text-xs py-3">
                                    <Eye className="mr-2 h-4 w-4 text-primary" />
                                    <span>Ver detalles</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="font-bold text-xs py-3">
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>Descargar PDF</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground font-medium">
                    Página <span className="text-foreground">{currentPage}</span> de {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1} className="rounded-xl font-bold h-9 text-xs">Anterior</Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((p, i, arr) => (
                          <div key={p} className="flex items-center gap-1">
                            {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-muted-foreground">...</span>}
                            <Button variant={currentPage === p ? "default" : "outline"} size="sm"
                              onClick={() => setCurrentPage(p)}
                              className={`w-9 h-9 rounded-xl font-bold text-xs ${currentPage === p ? "shadow-md shadow-primary/20" : ""}`}>
                              {p}
                            </Button>
                          </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages} className="rounded-xl font-bold h-9 text-xs">Siguiente</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ViewCalificacionDialog
        evaluacion={selectedEvaluacion}
        open={viewDialogOpen}
        onClose={() => { setViewDialogOpen(false); setSelectedEvaluacion(null) }}
        onSave={() => { recargarEvaluaciones(); setViewDialogOpen(false); setSelectedEvaluacion(null) }}
      />
    </div>
  )
}

// ── Page principal ────────────────────────────────────────────────────────────

export default function CalificacionesPage() {
  const { user, userRole } = useAuth()
  const isAdminOrSupervisor = userRole === "ADMINISTRADOR" || userRole === "SUPERVISOR" || userRole === "VINCULADOR"

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">

        {/* Hero */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <GraduationCap className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión de <span className="text-primary">Calificaciones</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                {isAdminOrSupervisor
                  ? "Visualiza y administra los resultados académicos de todos los estudiantes."
                  : "Visualiza y administra los resultados académicos de las evaluaciones de pasantías realizadas."}
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

        {isAdminOrSupervisor ? <AdminCalificacionesView /> : <TutorCalificacionesView />}

      </div>
    </Main>
  )
}
