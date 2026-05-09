import { GraduationCap } from "lucide-react";

export function EstudiantesHeader() {
  return (
    <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
      <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
        <GraduationCap className="w-80 h-80 text-primary -rotate-12" />
      </div>
      
      <div className="w-full relative px-6 md:px-12 z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
            Gestión <span className="text-primary">Académica</span> Estudiantil
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Administra expedientes, asignaciones y el progreso técnico de los estudiantes.
          </p>
        </div>
      </div>
    </div>
  );
}
