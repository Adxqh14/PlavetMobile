import { memo } from "react";
import { GraduationCap, Building2, Briefcase, FileText, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";

export const FeaturesSection = memo(function FeaturesSection() {
  return (
    <section className="py-20" id="tour-inicio-features">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Funcionalidades de Pla<span className="text-primary">vet</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Descubre todas las herramientas disponibles para gestionar eficientemente el proceso completo de pasantías.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Gestión de Estudiantes</CardTitle>
              <CardDescription>
                Administra perfiles completos de estudiantes, asigna tutores y realiza el seguimiento de su progreso
                académico y profesional durante las pasantías.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Registro de datos personales
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Asignación de tutores
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Historial académico
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
                <Building2 className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-xl">Gestión de Centros</CardTitle>
              <CardDescription>
                Administra centros de trabajo colaboradores, valida empresas y mantiene actualizada la base de datos de
                organizaciones disponibles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Registro de centros
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Validación de empresas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Búsqueda y filtros avanzados
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/30">
                <Briefcase className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Control de Pasantías</CardTitle>
              <CardDescription>
                Supervisa el proceso completo de pasantías desde la asignación hasta la culminación, con el seguimiento
                de visitas y evaluaciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Asignación automática
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Registro de visitas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Monitoreo en tiempo real
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <FileText className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-xl">Reportes y Documentos</CardTitle>
              <CardDescription>
                Genera y consulta documentos oficiales, cartas de visita, reportes de pasantías y certificaciones de
                culminación automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Generación automática
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Cartas de visita
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Exportación en PDF
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});
