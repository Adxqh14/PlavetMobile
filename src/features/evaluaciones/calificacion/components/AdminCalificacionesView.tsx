import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/shared/components/ui/table";
import {
  GraduationCap,
  Search,
  Filter,
  Users,
  Loader2,
  RefreshCw,
  Download,
  Award,
  TrendingUp,
  BookOpen,
} from "lucide-react";

import { isApproved } from "../utils";
import type { FilterNota } from "../types";
import { calificacionApiService, type CalificacionAdminItem } from "../../evaluacion/services/calificacionApiService";
import { apiClient } from "@/lib/api";
import { 
  calcSubtotalesReales, 
  calcNotaFinal, 
  calcNota, 
  studentName, 
  tallerName 
} from "../utils/adminCalificacionUtils";

interface TallerOption { id: string; nombre: string }

export function AdminCalificacionesView() {
  const [items, setItems] = useState<CalificacionAdminItem[]>([]);
  const [talleres, setTalleres] = useState<TallerOption[]>([]);
  const [selectedTaller, setSelectedTaller] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNota, setFilterNota] = useState<FilterNota>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Cargar todos los talleres de la BD
  useEffect(() => {
    apiClient.get<{ data: { id: string | number; nombre: string }[] }>("/api/v1/talleres", { pageSize: 100 })
      .then(res => {
        const items = res.data ?? [];
        setTalleres(items.map((t) => ({ id: String(t.id), nombre: t.nombre || "" })));
      })
      .catch(() => { });
  }, []);

  const fetchCalificaciones = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await calificacionApiService.getAll();
      setItems(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar calificaciones.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCalificaciones(); }, [fetchCalificaciones]);

  // Filtros cliente
  const filtered = useMemo(() => {
    let list = items;

    if (selectedTaller !== "todos") {
      const tallerSeleccionado = talleres.find(t => t.id === selectedTaller);
      if (tallerSeleccionado) {
        list = list.filter(i => tallerName(i) === tallerSeleccionado.nombre);
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(i =>
        studentName(i).toLowerCase().includes(q) ||
        tallerName(i).toLowerCase().includes(q) ||
        (i.estudiante_cedula ?? "").toLowerCase().includes(q) ||
        calcNota(i).includes(q)
      );
    }

    if (filterNota !== "todos") {
      list = list.filter(i => {
        const aprobado = isApproved(calcNota(i));
        return filterNota === "aprobado" ? aprobado : !aprobado;
      });
    }

    return list;
  }, [items, selectedTaller, talleres, searchTerm, filterNota]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filtered, currentPage]
  );

  // Reset página cuando cambian filtros
  useEffect(() => { setCurrentPage(1); }, [selectedTaller, searchTerm, filterNota]);

  // Stats
  const total = filtered.length;
  const aprobados = filtered.filter(i => isApproved(calcNota(i))).length;
  const reprobados = total - aprobados;
  const promedioGeneral = total > 0
    ? (filtered.reduce((acc, i) => acc + calcNotaFinal(i), 0) / total).toFixed(1)
    : "0";

  const statCards = [
    { title: "Total Evaluaciones", value: total, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Promedio General", value: promedioGeneral, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Estudiantes Aprobados", value: aprobados, icon: Award, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Estudiantes Reprobados", value: reprobados, icon: BookOpen, color: "text-rose-600", bg: "bg-rose-100" },
  ];

  const handleExport = () => {
    const headers = ["Estudiante", "Cédula", "Taller", "Capacidad", "Habilidad", "Actitud", "Nota Final", "Fecha"];
    const rows = filtered.map(i => {
      const s = calcSubtotalesReales(i);
      return [
        studentName(i),
        i.estudiante_cedula || "—",
        tallerName(i),
        s.capacidad.toFixed(1),
        s.habilidad.toFixed(1),
        s.actitud.toFixed(1),
        calcNotaFinal(i).toFixed(1),
        i.fecha,
      ].map(c => `"${c}"`).join(",");
    });
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `calificaciones_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

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
              {/* Filtro por taller */}
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
                      const subtotales = calcSubtotalesReales(item);
                      const notaFinal = calcNotaFinal(item);
                      const nota = String(Math.round(notaFinal));
                      const notaExact = notaFinal.toFixed(1);
                      const approved = isApproved(nota);
                      const { capacidad = 0, habilidad = 0, actitud = 0 } = subtotales;
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
                            <div className={`inline-flex flex-col items-center justify-center min-w-[70px] py-1 rounded-xl border transition-colors ${approved
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
                      );
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
  );
}
