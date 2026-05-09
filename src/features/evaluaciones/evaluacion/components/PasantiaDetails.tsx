import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { User, Building2, Loader2 } from "lucide-react";
import { SearchSelect } from "./SearchSelect";
import type { Pasantia } from "@/features/procesoDePasantias/gestionDePasantias/types";

interface PasantiaDetailsProps {
  pasantias: Pasantia[];
  selectedPasantia: Pasantia | null;
  onPasantiaSelect: (p: Pasantia) => void;
  onPasantiaClear: () => void;
  loadingPasantias: boolean;
  studentCedula: string;
  fechaInicio: string;
  fechaFin: string;
  tutorName: string;
  pasantiaEstado: string;
  horasAcumuladas: string;
}

type SearchableStudent = { nombre: string; apellido: string; cedula?: string | null; id: string };
type SearchableCompany = { id: string; nombre: string; ruc?: string; telefono?: string };

export function PasantiaDetails({
  pasantias,
  selectedPasantia,
  onPasantiaSelect,
  onPasantiaClear,
  loadingPasantias,
  studentCedula,
  fechaInicio,
  fechaFin,
  tutorName,
  pasantiaEstado,
  horasAcumuladas,
}: PasantiaDetailsProps) {
  // Obtener lista única de estudiantes con pasantías
  const students = Array.from(
    new Map(
      pasantias
        .filter((p) => p.estudiante)
        .map((p) => [p.id_estudiante, { ...p.estudiante!, id: p.id_estudiante }])
    ).values()
  );

  // Obtener lista única de empresas con pasantías
  const companies = Array.from(
    new Map(
      pasantias
        .filter((p) => p.centro_trabajo)
        .map((p) => [p.id_centro_trabajo, { ...p.centro_trabajo!, id: p.id_centro_trabajo }])
    ).values()
  );

  // Filtrar empresas basadas en el estudiante seleccionado (si aplica)
  const availableCompanies: SearchableCompany[] = selectedPasantia?.estudiante
    ? pasantias
        .filter((p) => p.id_estudiante === selectedPasantia.id_estudiante && p.centro_trabajo)
        .map((p) => ({ ...p.centro_trabajo!, id: p.id_centro_trabajo }))
    : companies;

  // Filtrar estudiantes basados en la empresa seleccionada (si aplica)
  const availableStudents: SearchableStudent[] = selectedPasantia?.centro_trabajo
    ? pasantias
        .filter((p) => p.id_centro_trabajo === selectedPasantia.id_centro_trabajo && p.estudiante)
        .map((p) => ({ ...p.estudiante!, id: p.id_estudiante }))
    : students;

  const handleStudentSelect = (student: SearchableStudent) => {
    if (selectedPasantia?.centro_trabajo) {
      const match = pasantias.find(
        (p) => p.id_estudiante === student.id && p.id_centro_trabajo === selectedPasantia.id_centro_trabajo
      );
      if (match) {
        onPasantiaSelect(match);
        return;
      }
    }
    const studentPasantias = pasantias.filter((p) => p.id_estudiante === student.id);
    if (studentPasantias.length === 1) {
      onPasantiaSelect(studentPasantias[0]);
    } else {
      onPasantiaSelect({ ...studentPasantias[0], id_centro_trabajo: "", centro_trabajo: undefined } as Pasantia);
    }
  };

  const handleCompanySelect = (company: SearchableCompany) => {
    if (selectedPasantia?.estudiante) {
      const match = pasantias.find(
        (p) => p.id_centro_trabajo === company.id && p.id_estudiante === selectedPasantia.id_estudiante
      );
      if (match) {
        onPasantiaSelect(match);
        return;
      }
    }
    const companyPasantias = pasantias.filter((p) => p.id_centro_trabajo === company.id);
    if (companyPasantias.length === 1) {
      onPasantiaSelect(companyPasantias[0]);
    } else {
      onPasantiaSelect({ ...companyPasantias[0], id_estudiante: "", estudiante: undefined } as Pasantia);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
      {!loadingPasantias && pasantias.length === 0 && (
        <div className="lg:col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold">No se encontraron pasantías activas</p>
            <p>Es posible que no tengas pasantías asignadas o que tu sesión haya expirado.</p>
          </div>
        </div>
      )}
      {/* Datos Personales */}
      <Card className="flex flex-col shadow-sm border-border">
        <CardHeader className="border-b bg-muted/30 py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">1. Datos Personales y Académicos</CardTitle>
            </div>
            {loadingPasantias && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <SearchSelect
            label="Estudiante"
            type="student"
            items={availableStudents}
            selectedItem={selectedPasantia?.estudiante ? { ...selectedPasantia.estudiante, id: selectedPasantia.id_estudiante } : null}
            onSelect={handleStudentSelect}
            onClear={onPasantiaClear}
            placeholder="Buscar por nombre o cédula..."
            getDisplayValue={(s: SearchableStudent) => `${s.nombre} ${s.apellido}`}
            getSubValue={(s: SearchableStudent) => s.cedula ?? ""}
            filterFn={(s: SearchableStudent, q: string) =>
              `${s.nombre} ${s.apellido}`.toLowerCase().includes(q.toLowerCase()) ||
              (s.cedula ?? "").includes(q)
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Cédula
              </Label>
              <Input
                className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                placeholder="—"
                value={studentCedula}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Horario
              </Label>
              <Input
                className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                placeholder="—"
                value="Matutino (Ejemplo)" 
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Fecha Inicio
              </Label>
              <Input
                type="date"
                className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                value={fechaInicio}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Fecha Fin
              </Label>
              <Input
                type="date"
                className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                value={fechaFin}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos de la Empresa */}
      <Card className="flex flex-col shadow-sm border-border">
        <CardHeader className="border-b bg-muted/30 py-3 px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">2. Datos de la Empresa</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <SearchSelect
            label="Centro Laboral"
            type="company"
            items={availableCompanies}
            selectedItem={selectedPasantia?.centro_trabajo ? { ...selectedPasantia.centro_trabajo, id: selectedPasantia.id_centro_trabajo } : null}
            onSelect={handleCompanySelect}
            onClear={onPasantiaClear}
            placeholder="Buscar por razón social o RUC..."
            getDisplayValue={(c: SearchableCompany) => c.nombre}
            getSubValue={(c: SearchableCompany) => c.ruc || "Sin RUC"}
            filterFn={(c: SearchableCompany, q: string) =>
              c.nombre.toLowerCase().includes(q.toLowerCase()) ||
              (c.ruc || "").includes(q)
            }
            disabled={!selectedPasantia?.estudiante && availableCompanies.length === companies.length}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Tutor Empresarial
              </Label>
              <Input
                className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                placeholder="—"
                value={tutorName}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Estado de Pasantía
              </Label>
              <Input
                className="h-8 text-xs bg-muted/30 border-transparent capitalize cursor-not-allowed"
                placeholder="—"
                value={pasantiaEstado}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Horas Acumuladas
              </Label>
              <Input
                className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                placeholder="—"
                value={horasAcumuladas}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Teléfonos Empresa
              </Label>
              <Input
                className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                placeholder="—"
                value={(selectedPasantia?.centro_trabajo as unknown as SearchableCompany)?.telefono || "—"} 
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
