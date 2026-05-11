import { memo } from "react";
import { Users, Building2, Award } from "lucide-react";

export const StatsSection = memo(function StatsSection() {
  return (
    <section className="border-b py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,500+</p>
              <p className="text-sm">Estudiantes Activos</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">250+</p>
              <p className="text-sm">Centros de Trabajo</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">95%</p>
              <p className="text-sm">Tasa de Éxito</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
