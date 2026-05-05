import { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Save, FolderOpen, Trash2, Plus, FileText, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import type { EvaluacionForm } from "../hooks/useEvaluacion";

interface Template {
  name: string;
  raContenido: string;
  criterio1: string;
  criterio2: string;
  criterio3: string;
  criterio4: string;
  criterio5: string;
  criterio6: string;
}

interface EvaluacionTableProps {
  evaluationForm: EvaluacionForm;
  setEvaluationForm?: React.Dispatch<React.SetStateAction<EvaluacionForm>>;
  readOnly?: boolean;
}

export function EvaluacionTable({ evaluationForm, setEvaluationForm, readOnly = false }: EvaluacionTableProps) {
  const [templates, setTemplates] = useState<Template[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTemplates = localStorage.getItem('evaluacion_templates');
      return savedTemplates ? JSON.parse(savedTemplates) : [];
    }
    return [];
  });
  const [currentTemplateName, setCurrentTemplateName] = useState<string | null>(null);

  // Estados para diálogos personalizados
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [templateToLoad, setTemplateToLoad] = useState<Template | null>(null);

  // Estados para imágenes de firmas
  const [firmaTutorImg, setFirmaTutorImg] = useState<string | null>(null);
  const [firmaEducativoImg, setFirmaEducativoImg] = useState<string | null>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
        toast.success("Firma importada correctamente.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("El nombre de la plantilla no puede estar vacío.");
      return;
    }

    if (templates.some(t => t.name.toLowerCase() === newTemplateName.toLowerCase())) {
      toast.error("Ya existe una plantilla con ese nombre.");
      return;
    }

    const newTemplate: Template = {
      name: newTemplateName,
      raContenido: evaluationForm.raContenido,
      criterio1: evaluationForm.criterio1,
      criterio2: evaluationForm.criterio2,
      criterio3: evaluationForm.criterio3,
      criterio4: evaluationForm.criterio4,
      criterio5: evaluationForm.criterio5,
      criterio6: evaluationForm.criterio6,
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    setCurrentTemplateName(newTemplateName);
    localStorage.setItem('evaluacion_templates', JSON.stringify(updatedTemplates));
    setIsSaveDialogOpen(false);
    setNewTemplateName("");
    toast.success(`Plantilla "${newTemplateName}" guardada correctamente.`);
  };

  const updateCurrentTemplate = () => {
    if (!currentTemplateName) return;

    const updatedTemplate: Template = {
      name: currentTemplateName,
      raContenido: evaluationForm.raContenido,
      criterio1: evaluationForm.criterio1,
      criterio2: evaluationForm.criterio2,
      criterio3: evaluationForm.criterio3,
      criterio4: evaluationForm.criterio4,
      criterio5: evaluationForm.criterio5,
      criterio6: evaluationForm.criterio6,
    };

    const updatedTemplates = templates.map(t => 
      t.name === currentTemplateName ? updatedTemplate : t
    );

    setTemplates(updatedTemplates);
    localStorage.setItem('evaluacion_templates', JSON.stringify(updatedTemplates));
    toast.success(`Cambios guardados en "${currentTemplateName}".`);
  };

  const confirmLoadTemplate = () => {
    if (!templateToLoad) return;
    setCurrentTemplateName(templateToLoad.name);
    setEvaluationForm?.({
      ...evaluationForm,
      raContenido: templateToLoad.raContenido,
      criterio1: templateToLoad.criterio1,
      criterio2: templateToLoad.criterio2,
      criterio3: templateToLoad.criterio3,
      criterio4: templateToLoad.criterio4,
      criterio5: templateToLoad.criterio5,
      criterio6: templateToLoad.criterio6,
    });
    setIsLoadDialogOpen(false);
    setTemplateToLoad(null);
    toast.info(`Plantilla "${templateToLoad.name}" cargada correctamente.`);
  };

  const handleDeleteTemplate = () => {
    if (!templateToDelete) return;
    const updatedTemplates = templates.filter(t => t.name !== templateToDelete);
    setTemplates(updatedTemplates);
    if (currentTemplateName === templateToDelete) setCurrentTemplateName(null);
    localStorage.setItem('evaluacion_templates', JSON.stringify(updatedTemplates));
    setIsDeleteDialogOpen(false);
    setTemplateToDelete(null);
    toast.success("Plantilla eliminada correctamente.");
  };

  const confirmClearCriteria = () => {
    setCurrentTemplateName(null);
    setEvaluationForm?.({
      ...evaluationForm,
      raContenido: "RA9.2: Participar a su nivel en la creación de bases de datos y en el mantenimiento, tomando en consideración las políticas establecidas por la empresa.",
      criterio1: "Crear bases de datos, utilizando herramientas de tablas, índices, funciones, procedimientos, siguiendo las especificaciones de diseño recibidas, y documentar las actuaciones realizadas y los resultados obtenidos.",
      criterio2: "Aplicar mantenimiento a la base de datos según los resultados de la consulta (update, insert, delete, select).",
      criterio3: "Verificar el funcionamiento de la base de datos, tomando en consideración las reglas de la empresa.",
      criterio4: "Interpretar la documentación técnica de la base de datos, identificando sus características funcionales y la compatibilidad, siguiendo políticas de la empresa.",
      criterio5: "Documentar el análisis de los resultados obtenidos de las pruebas realizadas. Siguiendo las normas establecidas por la empresa.",
      criterio6: "Administrar las actividades de los datos para garantizar que los usuarios trabajen en forma cooperativa y complementaria al procesar datos en la base de datos."
    });
    setIsClearDialogOpen(false);
    toast.info("Criterios restablecidos a los valores por defecto.");
  };

  const renderInputCells = (field: keyof EvaluacionForm) => {
    const values = evaluationForm[field] as string[];
    return (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <td key={i} className="border border-border p-0">
            <input
              type="text"
              className="w-full h-8 text-center text-[10px] focus:bg-primary/10 outline-none bg-transparent border-none text-foreground"
              value={values[i] || ""}
              readOnly={readOnly}
              onChange={(e) => {
                if (readOnly) return;
                const newValues = [...values];
                newValues[i] = e.target.value;
                setEvaluationForm?.({ ...evaluationForm, [field]: newValues });
              }}
            />
          </td>
        ))}
        <td className="border border-border bg-muted/30 p-0">
          <input
            type="text"
            className="w-full h-8 text-center text-[10px] font-bold outline-none bg-transparent border-none text-foreground"
            readOnly
            value=""
          />
        </td>
        <td className="border border-border bg-muted/30 p-0">
          <input
            type="text"
            className="w-full h-8 text-center text-[10px] font-bold outline-none bg-transparent border-none text-foreground"
            readOnly
            value=""
          />
        </td>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Premium Template Toolbar */}
      {!readOnly && (
        <div className="flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm gap-4">
          <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-tight">Gestor de Criterios</h3>
            <div className="flex items-center gap-2 mt-1">
              {currentTemplateName ? (
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] py-0 px-2 flex gap-1 items-center">
                  <Check className="w-2 h-2" /> {currentTemplateName}
                </Badge>
              ) : (
                <span className="text-[10px] text-muted-foreground italic">Usando plantilla predeterminada</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-[10px] hover:bg-muted" 
            onClick={() => setIsClearDialogOpen(true)}
            title="Restablecer criterios"
          >
            <Plus className="w-3 h-3 mr-1 rotate-45" />
            Limpiar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[10px] border-dashed">
                <FolderOpen className="w-3 h-3 mr-1" />
                Cargar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Plantillas Guardadas</div>
              <DropdownMenuSeparator />
              {templates.length === 0 ? (
                <div className="p-4 text-[10px] text-center text-muted-foreground italic">No has guardado plantillas aún</div>
              ) : (
                templates.map((t) => (
                  <DropdownMenuItem 
                    key={t.name} 
                    className="flex items-center justify-between text-[10px] py-2"
                    onSelect={() => {
                      setTemplateToLoad(t);
                      setIsLoadDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {currentTemplateName === t.name && <Check className="w-3 h-3 text-primary shrink-0" />}
                      <span className={`truncate ${currentTemplateName === t.name ? "font-bold text-primary" : ""}`}>
                        {t.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 shrink-0 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTemplateToDelete(t.name);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-border mx-1 hidden md:block" />
          
          {currentTemplateName && (
            <Button variant="secondary" size="sm" className="h-8 text-[10px] font-semibold" onClick={updateCurrentTemplate}>
              <Save className="w-3 h-3 mr-1" />
              Guardar Cambios
            </Button>
          )}

          <Button variant="default" size="sm" className="h-8 text-[10px] font-semibold shadow-sm" onClick={() => {
            setNewTemplateName(currentTemplateName || "");
            setIsSaveDialogOpen(true);
          }}>
            <Save className="w-3 h-3 mr-1" />
            {currentTemplateName ? "Guardar como nueva" : "Guardar Plantilla"}
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
                      readOnly={readOnly}
                      onChange={(e) => setEvaluationForm?.({ ...evaluationForm, raContenido: e.target.value })}
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
                      <div>
                        <span className="font-bold block mb-0.5">9.2.1</span>
                        <textarea
                          className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[60px] p-0"
                          value={evaluationForm.criterio1}
                          readOnly={readOnly}
                          onChange={(e) => setEvaluationForm?.({ ...evaluationForm, criterio1: e.target.value })}
                        />
                      </div>
                      <div>
                        <span className="font-bold block mb-0.5">9.2.2</span>
                        <textarea
                          className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[40px] p-0"
                          value={evaluationForm.criterio2}
                          readOnly={readOnly}
                          onChange={(e) => setEvaluationForm?.({ ...evaluationForm, criterio2: e.target.value })}
                        />
                      </div>
                      <div>
                        <span className="font-bold block mb-0.5">9.2.3</span>
                        <textarea
                          className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[40px] p-0"
                          value={evaluationForm.criterio3}
                          readOnly={readOnly}
                          onChange={(e) => setEvaluationForm?.({ ...evaluationForm, criterio3: e.target.value })}
                        />
                      </div>
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
                    <div>
                      <span className="font-bold block mb-0.5">9.2.4</span>
                        <textarea
                          className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[80px] p-0"
                          value={evaluationForm.criterio4}
                          readOnly={readOnly}
                          onChange={(e) => setEvaluationForm?.({ ...evaluationForm, criterio4: e.target.value })}
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
                      <div>
                        <span className="font-bold block mb-0.5">9.2.5</span>
                        <textarea
                          className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[60px] p-0"
                          value={evaluationForm.criterio5}
                          readOnly={readOnly}
                          onChange={(e) => setEvaluationForm?.({ ...evaluationForm, criterio5: e.target.value })}
                        />
                      </div>
                      <div>
                        <span className="font-bold block mb-0.5">9.2.6</span>
                        <textarea
                          className="w-full bg-transparent border-none outline-none resize-none text-[8px] italic opacity-80 min-h-[60px] p-0"
                          value={evaluationForm.criterio6}
                          readOnly={readOnly}
                          onChange={(e) => setEvaluationForm?.({ ...evaluationForm, criterio6: e.target.value })}
                        />
                      </div>
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

      {/* Pie de página dinámico */}
      <Card className="border-border shadow-none bg-card">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y divide-border">
            <div className="p-4">
              <Label className="text-[10px] font-bold uppercase mb-2 block text-foreground">Observaciones Generales:</Label>
              <Textarea 
                className="min-h-[80px] text-xs border border-border focus-visible:ring-1 p-2 shadow-none bg-muted/20 text-foreground"
                placeholder="Escriba aquí las observaciones detalladas sobre el desempeño..."
                value={evaluationForm.observaciones}
                readOnly={readOnly}
                onChange={(e) => setEvaluationForm?.({ ...evaluationForm, observaciones: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Tutor Centro de Trabajo */}
              <div className="p-0 flex flex-col">
                <div className="bg-muted/50 px-3 py-2 border-b border-border text-[10px] font-bold text-foreground flex items-center gap-2">
                  <Check className="w-3 h-3 text-primary" /> Tutor Centro de Trabajo
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border flex-1">
                  <div className="p-3 flex flex-col gap-2">
                    <Label className="text-[8px] uppercase text-muted-foreground">Fecha de Validación:</Label>
                    <Input 
                      type="date" 
                      className="h-8 text-[10px] bg-transparent border-border"
                      value={evaluationForm.fechaFirma}
                      readOnly={readOnly}
                      onChange={(e) => setEvaluationForm?.({ ...evaluationForm, fechaFirma: e.target.value })}
                    />
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <Label className="text-[8px] uppercase text-muted-foreground">Firma Digital / Importar:</Label>
                    <div 
                      className={`flex-1 min-h-[60px] border border-dashed border-border rounded-md flex flex-col items-center justify-center bg-muted/10 transition-colors group relative overflow-hidden ${!readOnly ? 'hover:bg-muted/20 cursor-pointer' : ''}`}
                      onClick={() => !readOnly && document.getElementById('firma-tutor-input')?.click()}
                    >
                      {firmaTutorImg || evaluationForm.firmaTutorCentro ? (
                        <img src={firmaTutorImg || (evaluationForm.firmaTutorCentro as string)} alt="Firma Tutor" className="max-h-[50px] w-auto object-contain" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[8px] text-muted-foreground mt-1">Haga clic para importar firma</span>
                        </>
                      )}
                      {!readOnly && (
                        <input 
                          id="firma-tutor-input" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileImport(e, setFirmaTutorImg)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tutor Centro Educativo */}
              <div className="p-0 flex flex-col">
                <div className="bg-muted/50 px-3 py-2 border-b border-border text-[10px] font-bold text-foreground flex items-center gap-2">
                  <Check className="w-3 h-3 text-primary" /> Tutor Centro Educativo
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border flex-1">
                  <div className="p-3 flex flex-col gap-2">
                    <Label className="text-[8px] uppercase text-muted-foreground">Fecha de Recepción:</Label>
                    <Input 
                      type="date" 
                      className="h-8 text-[10px] bg-transparent border-border"
                      readOnly={readOnly}
                    />
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <Label className="text-[8px] uppercase text-muted-foreground">Firma Digital / Importar:</Label>
                    <div 
                      className={`flex-1 min-h-[60px] border border-dashed border-border rounded-md flex flex-col items-center justify-center bg-muted/10 transition-colors group relative overflow-hidden ${!readOnly ? 'hover:bg-muted/20 cursor-pointer' : ''}`}
                      onClick={() => !readOnly && document.getElementById('firma-educativo-input')?.click()}
                    >
                      {firmaEducativoImg || evaluationForm.firmaTutorEducativo ? (
                        <img src={firmaEducativoImg || (evaluationForm.firmaTutorEducativo as string)} alt="Firma Educativo" className="max-h-[50px] w-auto object-contain" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[8px] text-muted-foreground mt-1">Haga clic para importar firma</span>
                        </>
                      )}
                      {!readOnly && (
                        <input 
                          id="firma-educativo-input" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileImport(e, setFirmaEducativoImg)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/5">
               <Label className="text-[10px] font-bold uppercase mb-2 block text-foreground">Notas Adicionales / Comentarios del Centro:</Label>
               <Textarea 
                className="min-h-[100px] text-xs border border-dashed border-primary/30 focus-visible:ring-1 p-3 shadow-none bg-primary/5 text-foreground italic"
                placeholder="Espacio para notas internas o comentarios adicionales del tutor empresarial..."
                readOnly={readOnly}
               />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DIÁLOGOS PERSONALIZADOS */}
      
      {/* Diálogo Guardar */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-primary" />
              Guardar Plantilla
            </DialogTitle>
            <DialogDescription>
              Asigna un nombre a esta configuración de criterios para usarla en futuras evaluaciones.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="name" className="text-right mb-2 block">
              Nombre de la plantilla
            </Label>
            <Input
              id="name"
              placeholder="Ej: Backend Developer, Administración..."
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTemplate}>Guardar Plantilla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Eliminar Plantilla
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la plantilla "<strong>{templateToDelete}</strong>"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>Eliminar Definitivamente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Limpiar */}
      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              Restablecer Criterios
            </DialogTitle>
            <DialogDescription>
              ¿Deseas limpiar los criterios actuales y volver a la configuración predeterminada? Se perderán los cambios no guardados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsClearDialogOpen(false)}>Cancelar</Button>
            <Button variant="secondary" onClick={confirmClearCriteria}>Restablecer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Diálogo Cargar */}
      <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <FolderOpen className="w-5 h-5" />
              Cargar Plantilla
            </DialogTitle>
            <DialogDescription>
              ¿Deseas cargar la plantilla "<strong>{templateToLoad?.name}</strong>"? Los criterios actuales serán reemplazados por los de esta plantilla.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsLoadDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmLoadTemplate}>Cargar Plantilla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
