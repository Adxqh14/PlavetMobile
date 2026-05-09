import { useState, useMemo } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
} from "lucide-react";

import { useCalificaciones } from "../hooks/useCalificaciones";
import { CalificacionService } from "../services/calificacionService";
import { StatsCards } from "./StatsCards";
import { ViewCalificacionDialog } from "./CalificacionDialogs";
import type { EvaluacionGuardada, FilterNota } from "../types";
import type { EvaluacionForm } from "../../evaluacion/types";
import { isApproved } from "../utils";

export function TutorCalificacionesView() {
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
  } = useCalificaciones();

  const talleres = useMemo(() => {
    const list = CalificacionService.getEvaluaciones().map(e => e.empresa);
    return Array.from(new Set(list)).sort();
  }, []);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<EvaluacionGuardada | null>(null);

  const handleView = (evaluacion: EvaluacionGuardada) => {
    setSelectedEvaluacion(evaluacion);
    setViewDialogOpen(true);
  };

  const handleExport = () => {
    const headers = ["Estudiante", "Empresa", "Prom. Capacidades", "Prom. Habilidades", "Prom. Actitudes", "Nota Final", "Fecha"];
    const csvContent = [
      headers.join(","),
      ...paginatedEvaluaciones.map((e: EvaluacionGuardada) =>
        [e.estudiante, e.empresa, e.promedioCapacidades, e.promedioHabilidades, e.promedioActitudes, e.notaFinal, e.fechaEvaluacion]
          .map(c => `"${c}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `calificaciones_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

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
                      const evaluacionCompleta = evaluacion.evaluacionCompleta as unknown as EvaluacionForm;
                      const approved = isApproved(evaluacion.notaFinal);
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
                              <div className={`flex flex-col items-center justify-center min-w-[70px] py-1 rounded-xl border transition-colors ${approved
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
                      );
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
        onClose={() => { setViewDialogOpen(false); setSelectedEvaluacion(null); }}
        onSave={() => { recargarEvaluaciones(); setViewDialogOpen(false); setSelectedEvaluacion(null); }}
      />
    </div>
  );
}
