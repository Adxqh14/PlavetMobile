"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "../../../shared/components/ui/button"
import { Card, CardContent, CardHeader } from "../../../shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/components/ui/select"
import { Input } from "../../../shared/components/ui/input"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "../../../shared/components/ui/table"
import {
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  User
} from "lucide-react"
import Main from "@/features/main/pages/page"
import { useCalificaciones } from "./hooks/useCalificaciones"
import { isApproved } from "./utils"
import type { EvaluacionGuardada, FilterNota } from "./types"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
  calificacionApiService,
  type CalificacionAdminItem,
  type TallerItem,
} from "../services/calificacionApiService"

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcNota(item: CalificacionAdminItem): string {
  const { capacidad = 0, habilidad = 0, actitud = 0 } = item.datos?.subtotales ?? {}
  const values = [capacidad, habilidad, actitud].filter(v => v > 0)
  if (values.length === 0) return "0"
  return String(Math.round(values.reduce((a, b) => a + b, 0) / values.length))
}

function studentName(item: CalificacionAdminItem): string {
  const e = item.estudiante
  if (!e) return "—"
  return `${e.nombre ?? ""} ${e.apellido ?? ""}`.trim() || "—"
}

function tallerName(item: CalificacionAdminItem): string {
  return item.estudiante?.taller?.nombre ?? "—"
}

// ── Vista Admin/Supervisor ────────────────────────────────────────────────────

function AdminCalificacionesView() {
  const [items, setItems] = useState<CalificacionAdminItem[]>([])
  const [filtered, setFiltered] = useState<CalificacionAdminItem[]>([])
  const [talleres, setTalleres] = useState<TallerItem[]>([])
  const [selectedTaller, setSelectedTaller] = useState<string>("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNota, setFilterNota] = useState<FilterNota>("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 10

  // Cargar talleres
  useEffect(() => {
    calificacionApiService.getTalleres().then(setTalleres).catch(() => {})
  }, [])

  // Cargar calificaciones (con filtro de taller si aplica)
  const fetchCalificaciones = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const tallerParam = selectedTaller !== "todos" ? Number(selectedTaller) : undefined
      const res = await calificacionApiService.getAll({ id_taller: tallerParam, pageSize: 200 })
      setItems(res.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar calificaciones.")
    } finally {
      setIsLoading(false)
    }
  }, [selectedTaller])

  useEffect(() => { fetchCalificaciones() }, [fetchCalificaciones])

  // Filtros cliente
  useEffect(() => {
    let list = items

    // Filtro taller client-side (por si el backend no lo soporta)
    if (selectedTaller !== "todos") {
      const id = Number(selectedTaller)
      list = list.filter(i => i.estudiante?.taller?.id === id)
    }

    // Búsqueda por nombre o nota
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(i =>
        studentName(i).toLowerCase().includes(q) ||
        tallerName(i).toLowerCase().includes(q) ||
        (i.centro_trabajo?.nombre ?? "").toLowerCase().includes(q) ||
        calcNota(i).includes(q)
      )
    }

    // Filtro aprobado/reprobado
    if (filterNota !== "todos") {
      list = list.filter(i => {
        const aprobado = isApproved(calcNota(i))
        return filterNota === "aprobado" ? aprobado : !aprobado
      })
    }

    setFiltered(list)
    setCurrentPage(1)
  }, [items, selectedTaller, searchTerm, filterNota])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Stats
  const total = filtered.length
  const aprobados = filtered.filter(i => isApproved(calcNota(i))).length
  const reprobados = total - aprobados
  const promedioGeneral = total > 0
    ? (filtered.reduce((acc, i) => acc + Number(calcNota(i)), 0) / total).toFixed(1)
    : "0"

  const statCards = [
    { title: "Total Evaluaciones", value: total, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Promedio General", value: promedioGeneral, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Aprobados", value: aprobados, icon: Award, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Reprobados", value: reprobados, icon: BookOpen, color: "text-rose-600", bg: "bg-rose-100" },
  ]

  const handleExport = () => {
    const headers = ["Estudiante", "Taller", "Empresa", "Capacidad", "Habilidad", "Actitud", "Nota Final", "Fecha"]
    const rows = filtered.map(i => [
      studentName(i),
      tallerName(i),
      i.centro_trabajo?.nombre ?? "—",
      String(Math.round(i.datos?.subtotales?.capacidad ?? 0)),
      String(Math.round(i.datos?.subtotales?.habilidad ?? 0)),
      String(Math.round(i.datos?.subtotales?.actitud ?? 0)),
      calcNota(i),
      i.fecha,
    ].map(c => `"${c}"`).join(","))
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

      {/* Filtros + Tabla */}
      <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-muted/10 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por estudiante, taller, empresa o nota..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20" />
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* Filtro por taller */}
              <Select value={selectedTaller} onValueChange={v => setSelectedTaller(v)}>
                <SelectTrigger className="w-full md:w-52 h-11 rounded-xl bg-background border-2 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <SelectValue placeholder="Filtrar por taller" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="todos" className="text-xs font-bold">Todos los talleres</SelectItem>
                  {talleres.map(t => (
                    <SelectItem key={t.id} value={String(t.id)} className="text-xs font-bold">
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro aprobado/reprobado */}
              <Select value={filterNota} onValueChange={v => setFilterNota(v as FilterNota)}>
                <SelectTrigger className="w-full md:w-44 h-11 rounded-xl bg-background border-2 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <SelectValue placeholder="Filtrar nota" />
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
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold py-4 w-20">ID</TableHead>
                      <TableHead className="font-semibold py-4">Estudiante</TableHead>
                      <TableHead className="font-semibold py-4">Taller</TableHead>
                      <TableHead className="font-semibold py-4">Empresa</TableHead>
                      <TableHead className="font-semibold py-4">Subtotales</TableHead>
                      <TableHead className="font-semibold py-4">Nota Final</TableHead>
                      <TableHead className="font-semibold py-4">Resultado</TableHead>
                      <TableHead className="font-semibold py-4">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map(item => {
                      const nota = calcNota(item)
                      const aprobado = isApproved(nota)
                      const { capacidad = 0, habilidad = 0, actitud = 0 } = item.datos?.subtotales ?? {}
                      return (
                        <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="py-4 font-bold text-xs text-muted-foreground">
                            #{item.id.slice(-6)}
                          </TableCell>
                          <TableCell className="py-4 font-bold text-foreground">
                            {studentName(item)}
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {tallerName(item)}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm text-muted-foreground max-w-[140px] truncate block"
                              title={item.centro_trabajo?.nombre ?? "—"}>
                              {item.centro_trabajo?.nombre ?? "—"}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                                C: {Math.round(capacidad)}
                              </span>
                              <span className="text-[10px] font-black bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100">
                                H: {Math.round(habilidad)}
                              </span>
                              <span className="text-[10px] font-black bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100">
                                A: {Math.round(actitud)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <Award className={`h-4 w-4 ${aprobado ? "text-amber-500" : "text-muted-foreground opacity-30"}`} />
                              <span className="font-black text-xl">{nota}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {aprobado ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                <span className="text-emerald-700 font-bold text-xs">Aprobado</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-rose-600" />
                                <span className="text-rose-700 font-bold text-xs">Reprobado</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-xs font-bold text-muted-foreground">
                            {item.fecha}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
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

// ── Vista Tutor Académico (localStorage) ──────────────────────────────────────

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
    stats,
    isLoading,
    recargarEvaluaciones
  } = useCalificaciones()

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

  const statCards = [
    { title: "Total Evaluaciones", value: stats.total, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Promedio General", value: stats.promedioGeneral, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Estudiantes Aprobados", value: stats.aprobados, icon: Award, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Estudiantes Reprobados", value: stats.reprobados, icon: BookOpen, color: "text-rose-600", bg: "bg-rose-100" },
  ]

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <Card key={i} className="border bg-card hover:shadow-md transition-shadow min-w-0">
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

      <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-muted/10 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar estudiante, empresa o nota..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20" />
            </div>
            <Select value={filterNota} onValueChange={(v: FilterNota) => setFilterNota(v)}>
              <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Filtrar nota" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2">
                <SelectItem value="todos" className="text-xs font-bold">Todas las notas</SelectItem>
                <SelectItem value="aprobado" className="text-xs font-bold">Aprobados (≥70)</SelectItem>
                <SelectItem value="reprobado" className="text-xs font-bold">Reprobados (&lt;70)</SelectItem>
              </SelectContent>
            </Select>
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
                No hay evaluaciones registradas que coincidan con los filtros.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold py-4 w-20">ID</TableHead>
                      <TableHead className="font-semibold py-4">Estudiante</TableHead>
                      <TableHead className="font-semibold py-4">Empresa</TableHead>
                      <TableHead className="font-semibold py-4">Promedios</TableHead>
                      <TableHead className="font-semibold py-4">Nota Final</TableHead>
                      <TableHead className="font-semibold py-4">Resultado</TableHead>
                      <TableHead className="font-semibold py-4">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEvaluaciones.map((evaluacion: EvaluacionGuardada) => (
                      <TableRow key={evaluacion.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="py-4 font-bold text-xs text-muted-foreground">
                          #{evaluacion.id.slice(-6)}
                        </TableCell>
                        <TableCell className="py-4 font-bold text-foreground">{evaluacion.estudiante}</TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-medium text-muted-foreground max-w-[150px] truncate block"
                            title={evaluacion.empresa}>{evaluacion.empresa}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                              C: {evaluacion.promedioCapacidades}
                            </span>
                            <span className="text-[10px] font-black bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100">
                              H: {evaluacion.promedioHabilidades}
                            </span>
                            <span className="text-[10px] font-black bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100">
                              A: {evaluacion.promedioActitudes}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Award className={`h-4 w-4 ${isApproved(evaluacion.notaFinal) ? "text-amber-500" : "text-muted-foreground opacity-30"}`} />
                            <span className="font-black text-xl">{evaluacion.notaFinal}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {isApproved(evaluacion.notaFinal) ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-700 font-bold text-xs">Aprobado</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-rose-600" />
                              <span className="text-rose-700 font-bold text-xs">Reprobado</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-xs font-bold text-muted-foreground">
                          {evaluacion.fechaEvaluacion}
                        </TableCell>
                      </TableRow>
                    ))}
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
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages} className="rounded-xl font-bold h-9 text-xs">Siguiente</Button>
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

// ── Page principal ────────────────────────────────────────────────────────────

export default function CalificacionesPage() {
  const { user, userRole } = useAuth()
  const isAdminOrSupervisor = userRole === "ADMINISTRADOR" || userRole === "SUPERVISOR"

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
