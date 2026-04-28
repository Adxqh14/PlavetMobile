"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, User, Building2, Mail, GraduationCap, MapPin, Check, Users } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import { ScrollArea } from "../../../shared/components/ui/scroll-area";
import type { Estudiante, Empresa } from "../types";
import { mockEstudiantes, mockEmpresas } from "../services/mockData";

interface SearchSelectProps {
  type: "estudiante" | "empresa";
  onSelect: (item: Estudiante | Empresa | null) => void;
  selectedItem?: Estudiante | Empresa | null;
  disabled?: boolean;
  placeholder?: string;
}

export function SearchSelect({ 
  type, 
  onSelect, 
  selectedItem, 
  disabled = false,
  placeholder 
}: SearchSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<(Estudiante | Empresa)[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchItems = useCallback(async () => {
    setLoading(true);
    try {
      // Simular búsqueda con mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockData = type === "estudiante" ? mockEstudiantes : mockEmpresas;
      const filtered = mockData.filter(item => {
        if (type === "estudiante") {
          const estudiante = item as Estudiante;
          return (
            estudiante.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.cedula.includes(searchTerm) ||
            estudiante.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          const empresa = item as Empresa;
          return (
            empresa.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            empresa.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            empresa.ruc.includes(searchTerm) ||
            empresa.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
      
      setItems(filtered);
      setShowResults(true);
    } catch (error) {
      console.error("Error buscando:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, type]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchItems();
    } else {
      setItems([]);
      setShowResults(false);
    }
  }, [searchTerm, searchItems]);

  const handleItemClick = (item: Estudiante | Empresa) => {
    onSelect(item);
    setShowResults(false);
    setSearchTerm("");
  };

  
  const renderSearchItem = (item: Estudiante | Empresa) => {
    if (type === "estudiante") {
      const estudiante = item as Estudiante;
      return (
        <Card
          key={estudiante.id}
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => handleItemClick(estudiante)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{estudiante.nombreCompleto}</span>
                  <Badge variant={estudiante.estado === 'Activo' ? 'default' : 'secondary'}>
                    {estudiante.estado}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>Cédula: {estudiante.cedula}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{estudiante.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3 w-3" />
                    <span className="truncate">{estudiante.carrera}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Promedio: {estudiante.promedioGeneral}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      const empresa = item as Empresa;
      return (
        <Card
          key={empresa.id}
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => handleItemClick(empresa)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{empresa.razonSocial}</span>
                  <Badge variant={empresa.estado === 'Activo' ? 'default' : 'secondary'}>
                    {empresa.estado}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {empresa.nombreComercial}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>RUC: {empresa.ruc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{empresa.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{empresa.ciudad}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>{empresa.cantidadPracticasActivas} prácticas</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar {type === "estudiante" ? "Estudiante" : "Empresa"}
            {selectedItem && (
              <Badge variant="secondary" className="ml-2">
                {type === "estudiante" 
                  ? (selectedItem as Estudiante).nombreCompleto 
                  : (selectedItem as Empresa).razonSocial
                } seleccionado
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {selectedItem 
              ? `Cambiar ${type === "estudiante" ? "estudiante" : "empresa"} seleccionado`
              : (placeholder || `Busca por ${type === "estudiante" ? "nombre, cédula o email" : "razón social, RUC o email"}`)
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={selectedItem ? "Buscar para cambiar selección..." : "Escribe al menos 2 caracteres para buscar..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={disabled}
            />
          </div>

          {showResults && (
            <div className="border rounded-lg">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Buscando...
                </div>
              ) : items.length > 0 ? (
                <ScrollArea className="h-64">
                  <div className="p-2 space-y-2">
                    {items.map(renderSearchItem)}
                  </div>
                </ScrollArea>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No se encontraron {type === "estudiante" ? "estudiantes" : "empresas"} con "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
