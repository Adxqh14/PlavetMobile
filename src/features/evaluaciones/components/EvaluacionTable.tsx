import React, { useRef } from "react";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Upload, Download, FileSpreadsheet, CheckCircle2, Save } from "lucide-react";
import { toast } from "sonner";
import type { EvaluacionForm } from "../hooks/useEvaluacion";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";

interface EvaluacionTableProps {
  evaluationForm: EvaluacionForm;
  setEvaluationForm?: React.Dispatch<React.SetStateAction<EvaluacionForm>>;
  readOnly?: boolean;
  tablaGuardada?: boolean;
  setTablaGuardada?: React.Dispatch<React.SetStateAction<boolean>>;
  onFileChange?: (file: File | null) => void;
}

// Tipo para las llaves de EvaluacionForm que son arreglos de strings
type EvaluacionArrayFields = {
  [K in keyof EvaluacionForm]: EvaluacionForm[K] extends string[] ? K : never
}[keyof EvaluacionForm];

// Mapeo de filas del Excel → campos del formulario (solo los que son arreglos)
const ROW_FIELD_MAP: Record<number, EvaluacionArrayFields> = {
  2: "conocimientosTeoricos",
  3: "asimilacionInstruccionesVerbales",
  4: "asimilacionInstruccionesEscritas",
  5: "asimilacionInstruccionesSimbolicas",
  6: "subtotalCapacidad",
  7: "organizacionPlanificacion",
  8: "metodo",
  9: "ritmoTrabajo",
  10: "trabajoRealizado",
  11: "subtotalHabilidad",
  12: "iniciativa",
  13: "trabajoEquipo",
  14: "puntualidadAsistencia",
  15: "responsabilidad",
  16: "subtotalActitud",
  17: "total",
};

function downloadTemplate() {
  const link = document.createElement("a");
  link.href = "/plantilla_evaluacion.xlsx";
  link.download = "plantilla_evaluacion.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function EvaluacionTable({ evaluationForm, setEvaluationForm, readOnly = false, tablaGuardada: propTablaGuardada, setTablaGuardada: propSetTablaGuardada, onFileChange }: EvaluacionTableProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localTablaGuardada, setLocalTablaGuardada] = React.useState(false);

  const tablaGuardada = propTablaGuardada !== undefined ? propTablaGuardada : localTablaGuardada;
  const setTablaGuardada = propSetTablaGuardada || setLocalTablaGuardada;

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileChange?.(file);

        const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Usamos raw: false para obtener los valores calculados/formateados
        const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false }) as unknown[][];
        if (!rows || rows.length < 2) return;

        // Buscamos dinámicamente la columna donde empiezan las semanas (1ª) y los totales
        const headerRow = rows[1] || []; 
        let week1Col = headerRow.findIndex(c => String(c || "").includes("1ª"));
        let promedioCol = headerRow.findIndex(c => String(c || "").includes("PROMEDIO"));
        let finalCol = headerRow.findIndex(c => String(c || "").includes("FINAL"));

        // Fallback si no se encuentran por nombre
        if (week1Col === -1) week1Col = 2;
        if (promedioCol === -1) promedioCol = week1Col + 12;
        if (finalCol === -1) finalCol = week1Col + 13;

        console.log(`Columnas detectadas: Semanas desde ${week1Col}, Promedio en ${promedioCol}, Final en ${finalCol}`);

        const updates: Partial<EvaluacionForm> = {};

        // Importar RA y Criterios (Texto)
        if (rows[0] && rows[0][2]) updates.raContenido = String(rows[0][2]).trim();
        if (rows[2] && rows[2][0]) updates.criterio1 = String(rows[2][0]).trim();
        if (rows[7] && rows[7][0]) updates.criterio4 = String(rows[7][0]).trim();
        if (rows[12] && rows[12][0]) updates.criterio5 = String(rows[12][0]).trim();

        // Empezamos a leer las filas de datos
        Object.keys(ROW_FIELD_MAP).forEach((idxStr) => {
          const rowIdx = parseInt(idxStr);
          const row = rows[rowIdx];
          const field = ROW_FIELD_MAP[rowIdx];
          
          if (row && field) {
            const rowValues: string[] = [];
            
            // 12 semanas
            for (let i = 0; i < 12; i++) {
              const val = row[week1Col + i];
              rowValues.push(val !== undefined && val !== null ? String(val).trim() : "");
            }
            
            // Promedio y Final
            rowValues.push(row[promedioCol] !== undefined ? String(row[promedioCol]).trim() : "");
            rowValues.push(row[finalCol] !== undefined ? String(row[finalCol]).trim() : "");
            
            updates[field] = rowValues as EvaluacionForm[typeof field] & string[];
          }
        });

        // --- AUTO-CALCULATION FALLBACK ---
        // Si el Excel no tiene las fórmulas calculadas (ej. al abrir con otros programas),
        // calculamos los promedios y subtotales nosotros mismos si están vacíos.
        const dataFields: (keyof EvaluacionForm)[] = [
          "conocimientosTeoricos", "asimilacionInstruccionesVerbales", "asimilacionInstruccionesEscritas", "asimilacionInstruccionesSimbolicas",
          "organizacionPlanificacion", "metodo", "ritmoTrabajo", "trabajoRealizado",
          "iniciativa", "trabajoEquipo", "puntualidadAsistencia", "responsabilidad"
        ];
        
        dataFields.forEach(field => {
          const arr = updates[field] as string[] | undefined;
          if (arr) {
            let sum = 0, count = 0;
            for (let i = 0; i < 12; i++) {
              const val = parseFloat(arr[i]);
              if (!isNaN(val)) { sum += val; count++; }
            }
            if (count > 0) {
              const avg = Math.round(sum / count);
              // Llenar promedio y final si están vacíos o son 0
              if (!arr[12] || arr[12] === "0") arr[12] = String(avg);
              if (!arr[13] || arr[13] === "0") arr[13] = String(avg);
            }
          }
        });

        const calcSubtotal = (subtotalField: EvaluacionArrayFields, depFields: EvaluacionArrayFields[]) => {
          if (!updates[subtotalField]) {
             updates[subtotalField] = Array(14).fill("") as EvaluacionForm[typeof subtotalField];
          }
          const subArr = updates[subtotalField] as string[];
          
          for (let i = 0; i < 14; i++) {
            if (!subArr[i] || subArr[i] === "0") {
              let sum = 0, count = 0;
              depFields.forEach(f => {
                const arr = updates[f] as string[] | undefined;
                if (arr && arr[i]) {
                  const val = parseFloat(arr[i]);
                  if (!isNaN(val)) { sum += val; count++; }
                }
              });
              if (count > 0) {
                subArr[i] = String(Math.round(sum / count));
              }
            }
          }
        };

        calcSubtotal("subtotalCapacidad", ["conocimientosTeoricos", "asimilacionInstruccionesVerbales", "asimilacionInstruccionesEscritas", "asimilacionInstruccionesSimbolicas"]);
        calcSubtotal("subtotalHabilidad", ["organizacionPlanificacion", "metodo", "ritmoTrabajo", "trabajoRealizado"]);
        calcSubtotal("subtotalActitud", ["iniciativa", "trabajoEquipo", "puntualidadAsistencia", "responsabilidad"]);
        calcSubtotal("total", ["subtotalCapacidad", "subtotalHabilidad", "subtotalActitud"]);

        const totalArr = updates.total as string[] | undefined;
        if (totalArr && totalArr[13]) {
          updates.notaFinal = totalArr[13];
        }

        console.log("Datos procesados dinámicamente:", updates);
        setEvaluationForm?.(prev => ({ ...prev, ...updates }));

        toast.success("Excel importado correctamente. Todos los datos (incluyendo subtotales y promedios) se han cargado.", {
          icon: <CheckCircle2 className="text-green-500 w-4 h-4" />,
          duration: 4000,
        });
      } catch (error) {
        console.error("Excel import error:", error);
        toast.error("Error al leer el archivo Excel. Asegúrate de usar la plantilla correcta.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const renderInputCells = (field: keyof EvaluacionForm) => {
    const values = (evaluationForm[field] || []) as string[];
    const isSubtotalOrTotal = field.toLowerCase().includes("subtotal") || field === "total";

    return (
      <>
        {Array.from({ length: 14 }, (_, i) => {
          const isTotalCell = i >= 12;
          return (
            <td 
              key={i} 
              className={cn(
                "border border-border p-0",
                (isTotalCell || isSubtotalOrTotal) ? "bg-muted/30" : ""
              )}
            >
              <input
                type="text"
                className={cn(
                  "w-full h-8 text-center text-[10px] outline-none bg-transparent border-none text-foreground",
                  (isTotalCell || isSubtotalOrTotal) ? "font-bold" : ""
                )}
                value={values[i] || ""}
                readOnly
              />
            </td>
          );
        })}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar Excel ── */}
      {!readOnly && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Tabla de Evaluación</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Descarga la plantilla, rellena en Excel y súbela para cargar los datos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Descargar plantilla */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[11px] gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => downloadTemplate()}
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Plantilla
            </Button>

            {/* Subir Excel */}
            <Button
              size="sm"
              className="h-8 text-[11px] gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" />
              Subir Excel
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleExcelUpload}
            />

            {/* Botón Guardar */}
            <div className="h-6 w-px bg-border mx-1" />
            <Button
              size="sm"
              variant={tablaGuardada ? "default" : "outline"}
              className={tablaGuardada 
                ? "h-8 text-[11px] gap-1.5 bg-green-600 hover:bg-green-700 text-white shadow-md font-bold transition-colors" 
                : "h-8 text-[11px] gap-1.5 text-green-700 border-green-200 hover:bg-green-50 shadow-sm transition-colors"}
              onClick={() => setTablaGuardada(!tablaGuardada)}
            >
              {tablaGuardada ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {tablaGuardada ? "Completado" : "Guardar"}
            </Button>
          </div>
        </div>
      )}

      <Card className="border-border shadow-none overflow-hidden bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-[9px] leading-tight">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted/50 text-left font-bold w-[180px] text-foreground">
                    Resultados de Aprendizaje
                  </th>
                  <th className="border border-border p-0 text-left font-bold text-foreground" colSpan={15}>
                    <textarea
                      className="w-full p-2 bg-transparent border-none outline-none resize-none font-bold text-[9px] min-h-[40px]"
                      value={evaluationForm.raContenido}
                      readOnly
                    />
                  </th>
                </tr>
                <tr>
                  <th className="border border-border p-2 bg-muted/50 text-left font-bold text-foreground">
                    Criterios de Evaluación
                  </th>
                  <th className="border border-border p-2 bg-muted/50 text-left font-bold text-foreground">
                    Indicadores valoración/semanas año escolar
                  </th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i} className="border border-border p-1 bg-muted/50 text-center font-bold min-w-[25px] text-foreground">
                      {i + 1}ª
                    </th>
                  ))}
                  <th className="border border-border p-1 bg-muted/50 text-center font-bold min-w-[50px] text-foreground">PROMEDIO</th>
                  <th className="border border-border p-1 bg-muted/50 text-center font-bold min-w-[40px] text-foreground">FINAL</th>
                </tr>
              </thead>
              <tbody>
                {/* SECCION CAPACIDAD */}
                <tr>
                  <td className="border border-border p-1 align-top text-[8px] text-foreground" rowSpan={5}>
                    <div className="space-y-2">
                      <textarea
                        className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[140px] p-0"
                        value={evaluationForm.criterio1}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className="border border-border p-2 text-foreground">Conocimientos teóricos</td>
                  {renderInputCells("conocimientosTeoricos")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Asimilación y seguimiento de instrucciones verbales</td>
                  {renderInputCells("asimilacionInstruccionesVerbales")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Asimilación y seguimiento de instrucciones escritas</td>
                  {renderInputCells("asimilacionInstruccionesEscritas")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Asimilación y seguimiento de instrucciones simbólicas</td>
                  {renderInputCells("asimilacionInstruccionesSimbolicas")}
                </tr>
                <tr className="bg-muted/30 font-bold">
                  <td className="border border-border p-2 text-foreground">SUBTOTAL CAPACIDAD</td>
                  {renderInputCells("subtotalCapacidad")}
                </tr>

                {/* SECCION HABILIDAD */}
                <tr>
                  <td className="border border-border p-1 align-top text-[8px] text-foreground" rowSpan={5}>
                    <div className="space-y-2">
                      <textarea
                        className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[140px] p-0"
                        value={evaluationForm.criterio4}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className="border border-border p-2 text-foreground">Organización planificación del trabajo</td>
                  {renderInputCells("organizacionPlanificacion")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Método</td>
                  {renderInputCells("metodo")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Ritmo de trabajo</td>
                  {renderInputCells("ritmoTrabajo")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Trabajo realizado</td>
                  {renderInputCells("trabajoRealizado")}
                </tr>
                <tr className="bg-muted/30 font-bold">
                  <td className="border border-border p-2 text-foreground">SUBTOTAL HABILIDAD</td>
                  {renderInputCells("subtotalHabilidad")}
                </tr>

                {/* SECCION ACTITUD */}
                <tr>
                  <td className="border border-border p-1 align-top text-[8px] text-foreground" rowSpan={6}>
                    <div className="space-y-2">
                      <textarea
                        className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[140px] p-0"
                        value={evaluationForm.criterio5}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className="border border-border p-2 text-foreground">Iniciativa</td>
                  {renderInputCells("iniciativa")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Trabajo en equipo</td>
                  {renderInputCells("trabajoEquipo")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Puntualidad y asistencia</td>
                  {renderInputCells("puntualidadAsistencia")}
                </tr>
                <tr>
                  <td className="border border-border p-2 text-foreground">Responsabilidad</td>
                  {renderInputCells("responsabilidad")}
                </tr>
                <tr className="bg-muted/30 font-bold">
                  <td className="border border-border p-2 text-foreground">SUBTOTAL ACTITUD</td>
                  {renderInputCells("subtotalActitud")}
                </tr>
                <tr className="bg-muted/50 font-black">
                  <td className="border border-border p-2 text-center uppercase tracking-wider text-foreground">Total</td>
                  {renderInputCells("total")}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones Generales */}
      <Card className="border-border shadow-none bg-card">
        <CardContent className="p-4">
          <Label className="text-[10px] font-bold uppercase mb-2 block text-foreground">Observaciones Generales:</Label>
          <Textarea
            className="min-h-[80px] text-xs border border-border focus-visible:ring-1 p-2 shadow-none bg-muted/20 text-foreground"
            placeholder="Escriba aquí las observaciones detalladas sobre el desempeño..."
            value={evaluationForm.observaciones}
            readOnly={readOnly}
            onChange={(e) => setEvaluationForm?.({ ...evaluationForm, observaciones: e.target.value })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
