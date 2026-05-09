import type { CalificacionAdminItem } from "../../evaluacion/services/calificacionApiService";

// El backend mete todas las competencias bajo CAPACIDAD aunque pertenezcan a
// HABILIDAD o ACTITUD. Reclasificamos por nombre para calcular subtotales reales.
export const NOMBRE_GRUPO: Record<string, "capacidad" | "habilidad" | "actitud"> = {
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
};

export interface Subtotales { capacidad: number; habilidad: number; actitud: number }

export function calcSubtotalesReales(item: CalificacionAdminItem): Subtotales {
  // Reunir todas las competencias de todos los grupos
  const all = [
    ...(item.datos?.competencias?.CAPACIDAD ?? []),
    ...(item.datos?.competencias?.HABILIDAD ?? []),
    ...(item.datos?.competencias?.ACTITUD ?? []),
  ];

  const groups: Record<"capacidad" | "habilidad" | "actitud", number[]> = {
    capacidad: [], habilidad: [], actitud: [],
  };

  for (const comp of all) {
    const grupo = NOMBRE_GRUPO[comp.nombre.toLowerCase().trim()];
    if (!grupo) continue;
    // Usar el campo promedio si existe, si no calcular de semanas
    const promedio = (comp as { promedio?: number }).promedio
      ?? (comp.semanas.length > 0
        ? comp.semanas.filter((v: number) => v > 0).reduce((a: number, b: number) => a + b, 0) /
        Math.max(1, comp.semanas.filter((v: number) => v > 0).length)
        : 0);
    if (promedio > 0) groups[grupo].push(promedio);
  }

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    capacidad: avg(groups.capacidad),
    habilidad: avg(groups.habilidad),
    actitud: avg(groups.actitud),
  };
}

export function calcNotaFinal(item: CalificacionAdminItem): number {
  const s = calcSubtotalesReales(item);
  const values = [s.capacidad, s.habilidad, s.actitud].filter(v => v > 0);
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function calcNota(item: CalificacionAdminItem): string {
  return String(Math.round(calcNotaFinal(item)));
}

export function studentName(item: CalificacionAdminItem): string {
  if (item.estudiante_nombre || item.estudiante_apellido)
    return `${item.estudiante_nombre ?? ""} ${item.estudiante_apellido ?? ""}`.trim();
  const e = item.estudiante;
  if (!e) return "—";
  return `${e.nombre ?? ""} ${e.apellido ?? ""}`.trim() || "—";
}

export function tallerName(item: CalificacionAdminItem): string {
  return item.taller_nombre || item.estudiante?.taller?.nombre || "—";
}
