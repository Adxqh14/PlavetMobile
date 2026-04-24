"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../../../../shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../shared/components/ui/popover";
import { Input } from "../../../../shared/components/ui/input";
import { TALLERES } from "../types";

interface TallerFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TallerFilter = ({ value, onValueChange }: TallerFilterProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Opciones: "todos" + los 8 talleres
  const allOptions = useMemo(
    () => [{ value: "todos", label: "Todos los talleres" }, ...TALLERES.map((t) => ({ value: t, label: t }))],
    []
  );

  // Filtrado por busqueda
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return allOptions;
    return allOptions.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allOptions]);

  const selectedLabel =
    value === "todos"
      ? "Todos los talleres"
      : TALLERES.find((t) => t === value) || "Seleccionar taller";

  return (
    <Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger>
    {/* Remove asChild from Button, it's already on PopoverTrigger */}
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-full md:w-56 justify-between bg-transparent text-foreground"
    >
      <div className="flex items-center gap-2 truncate">
        <Wrench className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{selectedLabel}</span>
      </div>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        {/* Campo de busqueda */}
        <div className="p-2 border-b">
          <Input
            placeholder="Buscar taller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        {/* Lista de talleres */}
        <div className="max-h-60 overflow-y-auto p-1">
          {filteredOptions.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No se encontraron talleres
            </p>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onValueChange(option.value);
                  setOpen(false);
                  setSearchQuery("");
                }}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  value === option.value && "bg-accent text-accent-foreground"
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 shrink-0",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="truncate">{option.label}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
