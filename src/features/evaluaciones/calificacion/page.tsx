"use client"

import { Button } from "../../../shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
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
  Eye, 
  Edit, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle
} from "lucide-react"
import Main from "@/features/main/pages/page"
import { useCalificaciones } from "./hooks/useCalificaciones"
import { isApproved } from "./utils"
import type { EvaluacionGuardada, FilterNota } from "./types"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function CalificacionesPage() {
  const { user, userRole } = useAuth();
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
  } = useCalificaciones();

  // Exportar a CSV
  const handleExport = () => {
    const headers = ['Estudiante', 'Empresa', 'Promedio Capacidades', 'Promedio Habilidades', 'Promedio Actitudes', 'Nota Final', 'Fecha Evaluación'];
    const csvContent = [
      headers.join(','),
      ...paginatedEvaluaciones.map((evaluacion: EvaluacionGuardada) => [
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
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Calificaciones de Evaluaciones
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Gestiona y visualiza las calificaciones de las evaluaciones de pasantías
            </p>
            {userRole === "TUTOR ACADEMICO" && user?.taller && (
              <div className="mt-2 ml-12 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span>Taller: {user.taller.nombre}</span>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Evaluaciones</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Promedio General</p>
                  <p className="text-2xl font-bold">{stats.promedioGeneral}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aprobados</p>
                  <p className="text-2xl font-bold">{stats.aprobados}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reprobados</p>
                  <p className="text-2xl font-bold">{stats.reprobados}</p>
                </div>
              </CardContent>
            </Card>
          </div>

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
                    className="gap-2 bg-transparent text-foreground"
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
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por estudiante, empresa o nota..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={filterNota} onValueChange={(value: FilterNota) => setFilterNota(value)}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por nota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas las notas</SelectItem>
                        <SelectItem value="aprobado">Aprobados (≥70)</SelectItem>
                        <SelectItem value="reprobado">Reprobados (&lt;70)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Mostrando {paginatedEvaluaciones.length} de {filteredEvaluaciones.length} evaluaciones (Página {currentPage} de {totalPages})
                  </p>

                  {/* Table - Diseño idéntico a plaza */}
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold w-20">ID</TableHead>
                          <TableHead className="font-semibold">Estudiante</TableHead>
                          <TableHead className="font-semibold">Empresa</TableHead>
                          <TableHead className="font-semibold">Promedios</TableHead>
                          <TableHead className="font-semibold">Nota Final</TableHead>
                          <TableHead className="font-semibold">Aprobado</TableHead>
                          <TableHead className="font-semibold">Fecha</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEvaluaciones.map((evaluacion: EvaluacionGuardada) => (
                          <TableRow key={evaluacion.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              #{evaluacion.id.slice(-6)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                <div>
                                  <div className="font-medium">{evaluacion.estudiante}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[200px] truncate" title={evaluacion.empresa}>
                                {evaluacion.empresa}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-muted-foreground">C:</span>
                                  <span>{evaluacion.promedioCapacidades}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-muted-foreground">H:</span>
                                  <span>{evaluacion.promedioHabilidades}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-muted-foreground">A:</span>
                                  <span>{evaluacion.promedioActitudes}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-yellow-500" />
                                <span className="font-bold text-lg">{evaluacion.notaFinal}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {isApproved(evaluacion.notaFinal) ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    <span className="text-emerald-600 font-medium">Aprobado</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <span className="text-red-600 font-medium">Reprobado</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {evaluacion.fechaEvaluacion}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Eye className="h-4 w-4" />
                                  Ver
                                </Button>
                                <Button size="sm" className="gap-1">
                                  <Edit className="h-4 w-4" />
                                  Editar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
      </div>
    </Main>
  );
}
