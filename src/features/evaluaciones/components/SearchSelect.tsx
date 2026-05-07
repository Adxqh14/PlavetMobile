"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, User, Building2, Mail, GraduationCap, Check } from "lucide-react";
import { Input } from "../../../shared/components/ui/input";
import { Badge } from "../../../shared/components/ui/badge";
import { ScrollArea } from "../../../shared/components/ui/scroll-area";
import type { Estudiante, Empresa } from "../types";

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
      // Leer de localStorage en lugar de mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const storageKey = type === "estudiante" ? "estudiantes" : "centrosTrabajo";
      const storedData = localStorage.getItem(storageKey);
      const data = storedData ? JSON.parse(storedData) : [];
      
      const filtered = data.filter((item: unknown) => {
        if (type === "estudiante") {
          const estudiante = item as Estudiante;
          return (
            (estudiante.nombreCompleto || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (estudiante.cedula || "").includes(searchTerm) ||
            (estudiante.email || "").toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          const empresa = item as Empresa;
          return (
            (empresa.razonSocial || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (empresa.nombreComercial || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (empresa.ruc || "").includes(searchTerm) ||
            (empresa.email || "").toLowerCase().includes(searchTerm.toLowerCase())
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
        <div
          key={estudiante.id}
          className="cursor-pointer hover:bg-accent/50 p-2.5 rounded-md border border-transparent hover:border-border transition-colors bg-background"
          onClick={() => handleItemClick(estudiante)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-xs text-foreground">{estudiante.nombreCompleto}</span>
                <Badge variant={estudiante.estado === 'Activo' ? 'default' : 'secondary'} className="text-[9px] px-1.5 py-0">
                  {estudiante.estado}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Cédula:</span> {estudiante.cedula}
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3 w-3" /> {estudiante.email}
                </div>
                <div className="flex items-center gap-1.5 truncate col-span-2">
                  <GraduationCap className="h-3 w-3" /> {estudiante.carrera}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      const empresa = item as Empresa;
      return (
        <div
          key={empresa.id}
          className="cursor-pointer hover:bg-accent/50 p-2.5 rounded-md border border-transparent hover:border-border transition-colors bg-background"
          onClick={() => handleItemClick(empresa)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-xs text-foreground">{empresa.razonSocial}</span>
                <Badge variant={empresa.estado === 'Activo' ? 'default' : 'secondary'} className="text-[9px] px-1.5 py-0">
                  {empresa.estado}
                </Badge>
              </div>
              <div className="text-[10px] text-muted-foreground font-medium mb-1.5">
                {empresa.nombreComercial}
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">RUC:</span> {empresa.ruc}
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3 w-3" /> {empresa.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative w-full max-w-[280px]">
      <div className="relative group">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder={selectedItem ? "Cambiar selección..." : placeholder || "Buscar..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-8 text-xs bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all shadow-none"
          disabled={disabled}
        />
        {selectedItem && !searchTerm && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Check className="h-3.5 w-3.5 text-primary" />
          </div>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full mt-1.5 right-0 w-[350px] z-50 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Resultados de Búsqueda
            </span>
            <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-border text-foreground">
              {items.length} encontrados
            </Badge>
          </div>
          
          {loading ? (
            <div className="p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Search className="h-5 w-5 animate-pulse text-muted-foreground/50" />
              <span className="text-xs font-medium">Buscando en la base de datos...</span>
            </div>
          ) : items.length > 0 ? (
            <ScrollArea className="max-h-[300px]">
              <div className="p-1.5 space-y-0.5 bg-popover">
                {items.map(renderSearchItem)}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs font-medium text-foreground">No se encontraron resultados para "{searchTerm}"</p>
              <p className="text-[10px]">Intente con otros términos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
