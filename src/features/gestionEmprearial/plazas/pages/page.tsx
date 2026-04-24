"use client";

import { useState } from "react";
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import { Input } from "../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";

import { usePlazas } from "../hooks/usePlazas";
import { StatsCards } from "../components/StatsCards";
import { PlazaTableRow } from "../components/PlazaTableRow";
import {
  CreatePlazaDialog,
  EditPlazaDialog,
  ViewPlazaDialog,
  DeletePlazaDialog, 
} from "../components/PlazaDialogs";
import type { Plaza } from "../types";
import Main from "@/features/main/pages/page";

// ==========================================
// Datos dummy para desarrollo
// ==========================================
const initialData: Plaza[] = [
  {
    id: 1,
    nombre: "Operador CNC",
    centro: "Centro Norte",
    titulo: "Operario",
    genero: "Indistinto",
    estado: "Activa",
    descripcion: "Operador de maquinas CNC para produccion",
    fechaCreacion: "2025-01-15",
    taller: "Informatica",
  },
  {
    id: 2,
    nombre: "Soldador TIG",
    centro: "Taller Central",
    titulo: "Operario",
    genero: "Masculino",
    estado: "Ocupada",
    descripcion: "Soldador especializado en TIG",
    fechaCreacion: "2025-02-20",
    taller: "Mecanizado",
  },
  {
    id: 3,
    nombre: "Electricista Industrial",
    centro: "Planta 1",
    titulo: "Supervisor",
    genero: "Indistinto",
    estado: "Inhabilitada",
    descripcion: "Mantenimiento electrico industrial",
    fechaCreacion: "2025-03-10",
    taller: "Electronica",
  },
  {
    id: 4,
    nombre: "Programador Java",
    centro: "Centro Norte",
    titulo: "Desarrollador",
    genero: "Indistinto",
    estado: "Activa",
    descripcion: "Desarrollo de aplicaciones empresariales",
    fechaCreacion: "2025-01-20",
    taller: "Informatica",
  },
  {
    id: 5,
    nombre: "Mecánico Automotriz",
    centro: "Taller Central",
    titulo: "Operario",
    genero: "Masculino",
    estado: "Ocupada",
    descripcion: "Reparación de vehículos ligeros",
    fechaCreacion: "2025-02-15",
    taller: "Automotriz",
  },
  {
    id: 6,
    nombre: "Contador Senior",
    centro: "Planta 1",
    titulo: "Analista",
    genero: "Femenino",
    estado: "Activa",
    descripcion: "Contabilidad financiera y fiscal",
    fechaCreacion: "2025-03-05",
    taller: "Contabilidad",
  },
  {
    id: 7,
    nombre: "Diseñador Gráfico",
    centro: "Centro Norte",
    titulo: "Desarrollador",
    genero: "Indistinto",
    estado: "Activa",
    descripcion: "Diseño de material gráfico y web",
    fechaCreacion: "2025-01-25",
    taller: "Informatica",
  },
  {
    id: 8,
    nombre: "Ebanista",
    centro: "Taller Central",
    titulo: "Operario",
    genero: "Masculino",
    estado: "Ocupada",
    descripcion: "Fabricación de muebles de madera",
    fechaCreacion: "2025-02-10",
    taller: "Ebanisteria",
  },
  {
    id: 9,
    nombre: "Técnico Electrónico",
    centro: "Planta 1",
    titulo: "Operario",
    genero: "Indistinto",
    estado: "Activa",
    descripcion: "Reparación de equipos electrónicos",
    fechaCreacion: "2025-03-12",
    taller: "Electronica",
  },
  {
    id: 10,
    nombre: "Patronista Industrial",
    centro: "Centro Norte",
    titulo: "Operario",
    genero: "Femenino",
    estado: "Inhabilitada",
    descripcion: "Creación de patrones de ropa industrial",
    fechaCreacion: "2025-01-18",
    taller: "Confeccion y Patronaje",
  },
  {
    id: 11,
    nombre: "Electricista Residencial",
    centro: "Taller Central",
    titulo: "Operario",
    genero: "Masculino",
    estado: "Activa",
    descripcion: "Instalaciones eléctricas residenciales",
    fechaCreacion: "2025-02-25",
    taller: "Electricidad",
  },
  {
    id: 12,
    nombre: "Analista de Sistemas",
    centro: "Planta 1",
    titulo: "Analista",
    genero: "Indistinto",
    estado: "Ocupada",
    descripcion: "Análisis y diseño de sistemas",
    fechaCreacion: "2025-03-08",
    taller: "Informatica",
  },
  {
    id: 13,
    nombre: "Mecánico de Precisión",
    centro: "Centro Norte",
    titulo: "Operario",
    genero: "Masculino",
    estado: "Activa",
    descripcion: "Mecanizado de alta precisión",
    fechaCreacion: "2025-01-22",
    taller: "Mecanizado",
  },
  {
    id: 14,
    nombre: "Costurera Industrial",
    centro: "Taller Central",
    titulo: "Operario",
    genero: "Femenino",
    estado: "Activa",
    descripcion: "Confección de prendas industriales",
    fechaCreacion: "2025-02-18",
    taller: "Confeccion y Patronaje",
  },
  {
    id: 15,
    nombre: "Supervisor de Producción",
    centro: "Planta 1",
    titulo: "Supervisor",
    genero: "Indistinto",
    estado: "Ocupada",
    descripcion: "Supervisión de líneas de producción",
    fechaCreacion: "2025-03-01",
    taller: "Mecanizado",
  },
  {
    id: 16,
    nombre: "Técnico en Redes",
    centro: "Centro Norte",
    titulo: "Desarrollador",
    genero: "Indistinto",
    estado: "Activa",
    descripcion: "Instalación y mantenimiento de redes",
    fechaCreacion: "2025-01-28",
    taller: "Informatica",
  },
  {
    id: 17,
    nombre: "Pintor Automotriz",
    centro: "Taller Central",
    titulo: "Operario",
    genero: "Masculino",
    estado: "Inhabilitada",
    descripcion: "Pintura y acabados de vehículos",
    fechaCreacion: "2025-02-12",
    taller: "Automotriz",
  },
  {
    id: 18,
    nombre: "Auditor Interno",
    centro: "Planta 1",
    titulo: "Analista",
    genero: "Femenino",
    estado: "Activa",
    descripcion: "Auditoría de procesos financieros",
    fechaCreacion: "2025-03-15",
    taller: "Contabilidad",
  }
];

export default function PlazasPage() {
  const {
    filteredPlazas,
    paginatedPlazas,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPlaza,
    updatePlaza,
    deletePlaza,
    centrosDisponibles,
    titulosDisponibles,
  } = usePlazas(initialData);

  // Estados locales para control de UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
  const [selectedPlaza, setSelectedPlaza] = useState<Plaza | null>(null);

  // Helper de Badge por estado
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activa":
        return <Badge variant="success">Activa</Badge>;
      case "Ocupada":
        return <Badge variant="slate-subtle">Ocupada</Badge>;
      case "Inhabilitada":
        return <Badge variant="grey">Inhabilitada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  // Handlers de acciones
  const handleView = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRequest = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlaza) {
      if (selectedPlaza.estado === 'Inhabilitada') {
        // Si ya está inhabilitada, eliminar totalmente
        deletePlaza(selectedPlaza.id);
      } else {
        // Si está activa/ocupada, cambiar a Inhabilitada
        updatePlaza({ ...selectedPlaza, estado: 'Inhabilitada' });
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRestore = (plaza: Plaza) => {
    // Restaurar la plaza cambiando su estado a Activa
    updatePlaza({ ...plaza, estado: 'Activa' });
    // Cambiar el filtro a "todos" para que se muestre en la tabla
    setFilterEstado('todos');
  };

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ['ID', 'Nombre', 'Centro', 'Título', 'Género', 'Estado', 'Descripción', 'Fecha Creación', 'Taller'],
      ...filteredPlazas.map(plaza => [
        plaza.id,
        plaza.nombre,
        plaza.centro,
        plaza.titulo,
        plaza.genero,
        plaza.estado,
        plaza.descripcion,
        plaza.fechaCreacion,
        plaza.taller
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `plazas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset page when filters change
  const handleFilterChange = (value: string) => {
    setFilterEstado(value);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  return (
    <Main>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Plazas de Centros de Trabajo
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Gestiona las plazas disponibles en los centros de trabajo y talleres
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Main Content */}
          <Card className="border">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    <Download className="h-4 w-4" /> Exportar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" /> Nueva Plaza
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, centro o taller..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterEstado} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Activa">Activa</SelectItem>
                    <SelectItem value="Ocupada">Ocupada</SelectItem>
                    <SelectItem value="Inhabilitada">Inhabilitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {paginatedPlazas.length} de {filteredPlazas.length} plazas (Página {currentPage} de {totalPages})
              </p>

              {/* Table */}
              {filteredPlazas.length > 0 ? (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold w-20">ID</TableHead>
                          <TableHead className="font-semibold">Nombre de Plaza</TableHead>
                          <TableHead className="font-semibold">Centro de Trabajo</TableHead>
                          <TableHead className="font-semibold">Genero</TableHead>
                          <TableHead className="font-semibold">Estado</TableHead>
                          <TableHead className="font-semibold">Fecha</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPlazas.map((plaza) => (
                          <PlazaTableRow
                            key={plaza.id}
                            plaza={plaza}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={() => handleDeleteRequest(plaza)}
                            onRestore={handleRestore}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination Controls */}
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
              ) : (
                <div className="rounded-lg border py-16 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay plazas que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros o crea una nueva plaza
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- Dialogos y Modales --- */}
        
        {/* Nuevo Diálogo de Confirmación para Eliminar */}
        <DeletePlazaDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          plazaNombre={selectedPlaza?.nombre}
          isInhabilitada={selectedPlaza?.estado === 'Inhabilitada'}
        />

        <CreatePlazaDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={addPlaza}
          centros={centrosDisponibles}
          titulos={titulosDisponibles}
        />

        <EditPlazaDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          plaza={selectedPlaza}
          onSubmit={updatePlaza}
          centros={centrosDisponibles}
          titulos={titulosDisponibles}
        />

        <ViewPlazaDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          plaza={selectedPlaza}
          getEstadoBadge={getEstadoBadge}
        />
      </div>
    </Main>
  );
}