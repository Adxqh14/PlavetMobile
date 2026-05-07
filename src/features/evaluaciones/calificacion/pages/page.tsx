"use client"

import { useState, useMemo } from "react"

import { Button } from "../../../../shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shared/components/ui/card"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  User,
  Users,
  MoreHorizontal
} from "lucide-react"
import Main from "@/features/main/pages/page"
import { useCalificaciones } from "../hooks/useCalificaciones"
import { isApproved } from "../utils"
import { StatsCards, ViewCalificacionDialog } from "../components"
import { CalificacionService } from "../services/calificacionService"
import type { EvaluacionGuardada, FilterNota } from "../types"
import type { EvaluacionForm } from "../../hooks/useEvaluacion"

export default function CalificacionesPage() {
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
    recargarEvaluaciones
  } = useCalificaciones();

  // Obtener lista única de talleres para el filtro
  const talleres = useMemo(() => {
    const list = CalificacionService.getEvaluaciones().map(e => e.empresa);
    return Array.from(new Set(list)).sort();
  }, []);

  // Estado para los diálogos
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<EvaluacionGuardada | null>(null);

  // Handlers para acciones
  const handleView = (evaluacion: EvaluacionGuardada) => {
    setSelectedEvaluacion(evaluacion);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedEvaluacion(null);
  };

  // Exportar a CSV
  const handleExport = () => {
    const headers = ['Estudiante', 'Empresa', 'Promedio Capacidades', 'Promedio Habilidades', 'Promedio Actitudes', 'Nota Final', 'Fecha Evaluación'];
    const csvContent = [
      headers.join(','),
      ...paginatedEvaluaciones.map(evaluacion => [
        evaluacion.estudiante,
        evaluacion.empresa,
        evaluacion.promedioCapacidades,
        evaluacion.promedioHabilidades,
        evaluacion.promedioActitudes,
        evaluacion.notaFinal,
        evaluacion.fechaEvaluacion
      ].map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calificaciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Main>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#d1323b]/10">
                <GraduationCap className="h-6 w-6 text-[#d1323b]" />
              </div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Calificaciones de Evaluaciones
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Gestiona y visualiza las calificaciones de las evaluaciones de pasantías
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Main Content */}
          <Card className="border">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle>Lista de Evaluaciones</CardTitle>
                  <CardDescription>
                    Evaluaciones completadas y calificaciones asignadas
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="gap-2 bg-transparent text-foreground hover:bg-[#d1323b]/5 hover:text-[#d1323b] hover:border-[#d1323b]/30"
                    disabled={paginatedEvaluaciones.length === 0}
                  >
                    <Download className="h-4 w-4" /> Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {filteredEvaluaciones.length === 0 ? (
                <div className="rounded-lg border py-16 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay evaluaciones registradas
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Completa una evaluación para ver las calificaciones aquí.
                  </p>
                </div>
              ) : (
                <>
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d1323b]" />
                      <Input
                        placeholder="Buscar por estudiante, empresa o nota..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 focus-visible:ring-[#d1323b]/20"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Select value={filterTaller} onValueChange={(value: string) => setFilterTaller(value)}>
                        <SelectTrigger className="w-full md:w-56 focus:ring-[#d1323b]/20">
                          <Users className="h-4 w-4 mr-2 text-[#d1323b]" />
                          <SelectValue placeholder="Filtrar por taller" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los talleres</SelectItem>
                          {talleres.map((taller: string) => (
                            <SelectItem key={taller} value={taller}>{taller}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filterNota} onValueChange={(value: FilterNota) => setFilterNota(value)}>
                        <SelectTrigger className="w-full md:w-48 focus:ring-[#d1323b]/20">
                          <Filter className="h-4 w-4 mr-2 text-[#d1323b]" />
                          <SelectValue placeholder="Filtrar por nota" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todas las notas</SelectItem>
                          <SelectItem value="aprobado">Aprobados (≥70)</SelectItem>
                          <SelectItem value="reprobado">Reprobados (&lt;70)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Mostrando {paginatedEvaluaciones.length} de {filteredEvaluaciones.length} evaluaciones (Página {currentPage} de {totalPages})
                  </p>

                  {/* Table - Diseño de Alto Rendimiento */}
                  <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 border-b border-border">
                          <TableHead className="font-semibold py-4 pl-6">Estudiante / Carrera</TableHead>
                          <TableHead className="font-semibold">Empresa / Evaluador</TableHead>
                          <TableHead className="font-semibold text-center">Rendimiento (C/H/A)</TableHead>
                          <TableHead className="font-semibold text-right pr-6">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEvaluaciones.map((evaluacion) => {
                          const evaluacionCompleta = evaluacion.evaluacionCompleta as unknown as EvaluacionForm;
                          const approved = isApproved(evaluacion.notaFinal);
                          
                          return (
                            <TableRow key={evaluacion.id} className="hover:bg-muted/50 transition-colors border-b border-border last:border-0">
                              <TableCell className="py-4 pl-6">
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground">{evaluacion.estudiante}</span>
                                  <span className="text-[10px] text-muted-foreground font-normal uppercase truncate max-w-[200px]">
                                    {evaluacionCompleta.identidadTitulo}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-foreground">{evaluacion.empresa}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1 italic">
                                    <User className="w-3 h-3" /> {evaluacionCompleta.nombreTutor || 'Sin asignar'}
                                  </span>
                                </div>
                              </TableCell>
                              
                              <TableCell className="py-4">
                                <div className="flex items-center justify-center gap-4">
                                  <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-[10px] font-semibold text-foreground">{evaluacion.promedioCapacidades}</span>
                                    <div className="w-6 h-1 rounded-full bg-blue-500/20 dark:bg-blue-500/10 overflow-hidden">
                                      <div className="h-full bg-blue-500" style={{ width: `${evaluacion.promedioCapacidades}%` }} />
                                    </div>
                                    <span className="text-[7px] text-muted-foreground font-medium uppercase">Cap</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-[10px] font-semibold text-foreground">{evaluacion.promedioHabilidades}</span>
                                    <div className="w-6 h-1 rounded-full bg-purple-500/20 dark:bg-purple-500/10 overflow-hidden">
                                      <div className="h-full bg-purple-500" style={{ width: `${evaluacion.promedioHabilidades}%` }} />
                                    </div>
                                    <span className="text-[7px] text-muted-foreground font-medium uppercase">Hab</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-[10px] font-semibold text-foreground">{evaluacion.promedioActitudes}</span>
                                    <div className="w-6 h-1 rounded-full bg-green-500/20 dark:bg-green-500/10 overflow-hidden">
                                      <div className="h-full bg-green-500" style={{ width: `${evaluacion.promedioActitudes}%` }} />
                                    </div>
                                    <span className="text-[7px] text-muted-foreground font-medium uppercase">Act</span>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="py-4 text-right pr-6">
                                <div className="flex items-center justify-end gap-3">
                                  <div className={`flex flex-col items-center justify-center min-w-[65px] py-1 rounded-lg border transition-colors ${
                                    approved 
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" 
                                      : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                                  }`}>
                                    <span className="text-lg font-bold leading-none tracking-tight">{evaluacion.notaFinal}</span>
                                    <span className="text-[8px] font-bold uppercase mt-0.5 opacity-80">{approved ? 'Aprobado' : 'Reprobado'}</span>
                                  </div>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                        <span className="sr-only">Abrir menú</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                      <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">Acciones</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleView(evaluacion)} className="cursor-pointer py-2">
                                        <Eye className="mr-2 h-4 w-4 text-primary" />
                                        <span>Ver detalles</span>
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

                  {/* Pagination Controls - Idénticos a plaza */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="gap-1"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Diálogos */}
        <ViewCalificacionDialog
          evaluacion={selectedEvaluacion}
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          onSave={() => {
            recargarEvaluaciones();
            setViewDialogOpen(false);
            setSelectedEvaluacion(null);
          }}
        />
      </div>
    </Main>
  );
}
