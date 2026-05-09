import React from "react";
import { Badge } from "@/shared/components/ui/badge";
import type { MisNotasResponse, CompetenciaItem } from "../../evaluacion/services/calificacionApiService";
import { type EvaluacionForm } from "../../evaluacion/types";

export function getNotaBadge(nota: number | string) {
  const n = typeof nota === "string" ? parseFloat(nota) : nota;
  if (n >= 90) {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Excelente
      </Badge>
    );
  } else if (n >= 80) {
    return (
      <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Muy Bueno
      </Badge>
    );
  } else if (n >= 70) {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Aprobado
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-500/15 text-red-700 border-red-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
      Reprobado
    </Badge>
  );
}

// Mapeo de la respuesta del API al formato de la tabla de main
export const mapResponseToForm = (data: MisNotasResponse): EvaluacionForm => {
  const initialArray = () => Array(14).fill("");

  const form: EvaluacionForm = {
    identidadTitulo: "",
    codigoTitulo: "",
    nombreApellidos: "",
    horario: "",
    direccion: "",
    telefonos: "",
    fechaInicioPasantia: "",
    fechaTerminoPasantia: "",
    centroTrabajo: "",
    direccionEmpresa: "",
    telefonosEmpresa: "",
    personaContacto: "",
    nombreTutor: "",
    telefonosCorreoTutor: "",

    // Mapeo de contenidos
    raContenido: data.ra,
    observaciones: data.observaciones || "",
    notaFinal: "", // Se calculará abajo

    // Inicialización de arrays
    conocimientosTeoricos: initialArray(),
    asimilacionInstruccionesVerbales: initialArray(),
    asimilacionInstruccionesEscritas: initialArray(),
    asimilacionInstruccionesSimbolicas: initialArray(),
    subtotalCapacidad: initialArray(),

    organizacionPlanificacion: initialArray(),
    metodo: initialArray(),
    ritmoTrabajo: initialArray(),
    trabajoRealizado: initialArray(),
    subtotalHabilidad: initialArray(),

    iniciativa: initialArray(),
    trabajoEquipo: initialArray(),
    puntualidadAsistencia: initialArray(),
    responsabilidad: initialArray(),
    subtotalActitud: initialArray(),

    total: initialArray(),

    promedioCapacidades: "",
    promedioHabilidades: "",
    promedioActitudes: "",
    criterio1: "",
    criterio2: "",
    criterio3: "",
    criterio4: "",
    criterio5: "",
    criterio6: "",
  };

  // Mapeo nombre → campo del formulario (case-insensitive, tolerante a variaciones)
  const NOMBRE_A_CAMPO: Record<string, keyof EvaluacionForm> = {
    "conocimientos teóricos": "conocimientosTeoricos",
    "conocimientos teoricos": "conocimientosTeoricos",
    "asimilación y seguimiento de instrucciones verbales": "asimilacionInstruccionesVerbales",
    "asimilacion y seguimiento de instrucciones verbales": "asimilacionInstruccionesVerbales",
    "asimilación y seguimiento de instrucciones escritas": "asimilacionInstruccionesEscritas",
    "asimilacion y seguimiento de instrucciones escritas": "asimilacionInstruccionesEscritas",
    "asimilación y seguimiento de instrucciones simbólicas": "asimilacionInstruccionesSimbolicas",
    "asimilacion y seguimiento de instrucciones simbolicas": "asimilacionInstruccionesSimbolicas",
    "organización planificación del trabajo": "organizacionPlanificacion",
    "organización y planificación del trabajo": "organizacionPlanificacion",
    "organizacion planificacion del trabajo": "organizacionPlanificacion",
    "organizacion y planificacion del trabajo": "organizacionPlanificacion",
    "método": "metodo",
    "metodo": "metodo",
    "ritmo de trabajo": "ritmoTrabajo",
    "trabajo realizado": "trabajoRealizado",
    "iniciativa": "iniciativa",
    "trabajo en equipo": "trabajoEquipo",
    "puntualidad y asistencia": "puntualidadAsistencia",
    "responsabilidad": "responsabilidad",
  };

  const mapGroup = (items: CompetenciaItem[], fallbackFields: (keyof EvaluacionForm)[]) => {
    items.forEach((item, i) => {
      const campo = NOMBRE_A_CAMPO[item.nombre.toLowerCase().trim()] ?? fallbackFields[i];
      if (!campo) return;

      const weeks = Array(14).fill("");
      item.semanas.forEach((v, wi) => { if (wi < 12) weeks[wi] = v > 0 ? String(v) : ""; });

      const valid = item.semanas.filter(v => v > 0);
      const avg = valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0;
      weeks[12] = avg > 0 ? String(avg) : "";
      weeks[13] = avg > 0 ? String(avg) : "";

      (form[campo as keyof EvaluacionForm] as string[]) = weeks;
    });
  };

  mapGroup(data.datos.competencias.CAPACIDAD, ["conocimientosTeoricos", "asimilacionInstruccionesVerbales", "asimilacionInstruccionesEscritas", "asimilacionInstruccionesSimbolicas"]);
  mapGroup(data.datos.competencias.HABILIDAD, ["organizacionPlanificacion", "metodo", "ritmoTrabajo", "trabajoRealizado"]);
  mapGroup(data.datos.competencias.ACTITUD, ["iniciativa", "trabajoEquipo", "puntualidadAsistencia", "responsabilidad"]);

  // Calcular subtotales
  const calcSubtotal = (fields: (keyof EvaluacionForm)[], target: keyof EvaluacionForm) => {
    const subtotal = Array(14).fill("");
    for (let wi = 0; wi < 14; wi++) {
      let sum = 0, count = 0;
      fields.forEach(f => {
        const val = parseFloat((form[f as keyof EvaluacionForm] as string[])[wi]);
        if (!isNaN(val) && val > 0) { sum += val; count++; }
      });
      if (count > 0) subtotal[wi] = String(Math.round(sum / count));
    }
    (form[target as keyof EvaluacionForm] as string[]) = subtotal;
  };

  calcSubtotal(["conocimientosTeoricos", "asimilacionInstruccionesVerbales", "asimilacionInstruccionesEscritas", "asimilacionInstruccionesSimbolicas"], "subtotalCapacidad");
  calcSubtotal(["organizacionPlanificacion", "metodo", "ritmoTrabajo", "trabajoRealizado"], "subtotalHabilidad");
  calcSubtotal(["iniciativa", "trabajoEquipo", "puntualidadAsistencia", "responsabilidad"], "subtotalActitud");
  calcSubtotal(["subtotalCapacidad", "subtotalHabilidad", "subtotalActitud"], "total");

  const totalArr = form.total as string[];
  form.notaFinal = totalArr[13] || "0";
  form.promedioCapacidades = (form.subtotalCapacidad as string[])[13] || "0";
  form.promedioHabilidades = (form.subtotalHabilidad as string[])[13] || "0";
  form.promedioActitudes = (form.subtotalActitud as string[])[13] || "0";

  return form;
};
