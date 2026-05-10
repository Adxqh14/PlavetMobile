import { FileText, User } from "lucide-react";

interface ExcusasHeroProps {
  userRole?: string | null;
  userTaller?: { nombre: string };
}

export const ExcusasHero = ({ userRole, userTaller }: ExcusasHeroProps) => {
  return (
    <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
      <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
        <FileText className="w-80 h-80 text-primary -rotate-12" />
      </div>
      <div className="w-full relative px-6 md:px-12 z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
            {userRole === "ESTUDIANTE" ? "Historial de" : "Gestión de"} <span className="text-primary">Excusas</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Sistema para el registro, seguimiento y validación de inasistencias justificadas en el programa de pasantías.
          </p>
          {userRole === "TUTOR ACADEMICO" && userTaller && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary border border-primary/20">
              <User className="h-4 w-4" />
              <span>Taller: {userTaller.nombre}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
