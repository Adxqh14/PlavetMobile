import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ClipboardList } from "lucide-react";
import { EvaluacionTable } from "./EvaluacionTable";
import type { EvaluacionForm } from "../types";

interface EvaluacionFormSectionProps {
  evaluationForm: EvaluacionForm;
  setEvaluationForm: React.Dispatch<React.SetStateAction<EvaluacionForm>>;
  tablaGuardada: boolean;
  setTablaGuardada: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadedFile: (file: File | null) => void;
}

export function EvaluacionFormSection({
  evaluationForm,
  setEvaluationForm,
  tablaGuardada,
  setTablaGuardada,
  setUploadedFile,
}: EvaluacionFormSectionProps) {
  return (
    <Card>
      <CardHeader className="border-b bg-muted/30 py-3 px-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">3. Evaluación</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-4 pb-4">
        <EvaluacionTable
          evaluationForm={evaluationForm}
          setEvaluationForm={setEvaluationForm}
          tablaGuardada={tablaGuardada}
          setTablaGuardada={setTablaGuardada}
          onFileChange={setUploadedFile}
        />
      </CardContent>
    </Card>
  );
}
