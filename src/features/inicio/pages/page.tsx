import { Button } from "../../../shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Badge } from "../../../shared/components/ui/badge"
import { Separator } from "../../../shared/components/ui/separator"
import {
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Award,
  User,
  LogOut,
  LogIn,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ModeToggle } from "../../main/components/mode-toggle"
import { useTour } from "../../../shared/hooks/useTour"


export default function InicioPage() {
  // Siempre iniciar como no autenticado al cargar la página
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Limpiar cualquier sesión existente al cargar la página
  useEffect(() => {
    sessionStorage.removeItem('isLoggedIn');
  }, []);

  // Tutorial de inicio
  useTour('tutorial_inicio', [
    { element: '#tour-inicio-header', popover: { title: 'Bienvenidos a Plavet', description: 'Tu sistema integral de gestión de pasantías.', side: "bottom", align: 'start' } },
    { element: '#tour-inicio-login', popover: { title: 'Acceso Rápido', description: 'Aquí podrás iniciar sesión en tu cuenta en cualquier momento.', side: "bottom", align: 'start' } },
    { element: '#tour-inicio-welcome', popover: { title: 'Presentación', description: 'Conectamos estudiantes con el mundo laboral.', side: "bottom", align: 'center' } },
    { element: '#tour-inicio-stats', popover: { title: 'Nuestra Comunidad', description: 'Descubre los increíbles números de impacto de nuestro sistema.', side: "top", align: 'center' } },
    { element: '#tour-inicio-features', popover: { title: 'Funcionalidades', description: 'Explora todas las herramientas diseñadas para simplificar tus procesos.', side: "top", align: 'center' } },
    { element: '#tour-inicio-benefits', popover: { title: 'Por qué elegirnos', description: 'Conoce todas las ventajas y beneficios de ser parte de Plavet.', side: "top", align: 'center' } },
    { element: '#tour-inicio-about', popover: { title: 'Nuestros Valores', description: 'Lee sobre nuestra misión y visión hacia el futuro.', side: "top", align: 'center' } }
  ], 800);

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (

    <div className="min-h-screen bg-background">
      {/* Header with Authentication */}
      <header id="tour-inicio-header" className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">
            Pla<span className="text-primary">vet</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {!authenticated && (
            <Button id="tour-inicio-login" variant="outline" size="sm" onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
          )}

          {authenticated && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Usuario</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </header>

      <section
        id="tour-inicio-welcome"
        className="border-b relative overflow-hidden" >
        {/* Background Image with Premium Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-10 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-background" />
        </div>
        <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              Sistema de Gestión de Pasantías y Empleabilidad
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Bienvenido a Pla<span className="text-primary">vet</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed md:text-xl text-muted-foreground">
              Sistema integral de gestión de pasantías y plazas que optimiza el proceso desde su inicio hasta su cierre,
             conectando estudiantes, instituciones y centros de trabajo en una sola plataforma.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => navigate('/login')}>
                <LogIn className="mr-2 h-5 w-5" />
                Iniciar Sesión
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-8 font-bold border-2 hover:bg-primary/5 transition-all" onClick={() => {
                document.getElementById('tour-inicio-features')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explorar Módulos
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="tour-inicio-stats" className="border-b py-12">
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

      <section id="tour-inicio-features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Funcionalidades de Pla<span className="text-primary">vet</span>
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Descubre todas las herramientas disponibles para gestionar eficientemente el proceso completo de pasantías
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
                  Administra perfiles completos de estudiantes, asigna tutores, y realiza seguimiento de su progreso
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
                  Administra centros de trabajo colaboradores, valida empresas, mantén actualizada la base de datos de
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
                  Supervisa el proceso completo de pasantías desde la asignación hasta la culminación, con seguimiento
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

      <section id="tour-inicio-benefits" className="py-20">
        <div className="container mx-auto px-6 ">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Beneficios de Pla<span className="text-primary">vet</span>
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Descubre los beneficios de utilizar Plavet para gestionar tus pasantías
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Automatización Inteligente</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Reduce tareas manuales con flujos de trabajo automatizados que ahorran tiempo y minimizan errores en
                  el proceso.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Seguridad Garantizada</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Protección de datos con encriptación avanzada y cumplimiento de normativas de privacidad
                  institucionales.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Análisis en Tiempo Real</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Visualiza estadísticas y métricas clave con dashboards interactivos para tomar decisiones informadas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Acceso 24/7</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Plataforma disponible en cualquier momento desde cualquier dispositivo con conexión a internet.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Escalabilidad</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Crece con tu institución, soportando desde decenas hasta miles de estudiantes simultáneamente.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Colaboración Efectiva</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Facilita la comunicación entre estudiantes, tutores, empresas e instituciones en un solo lugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS */}
      <section id="tour-inicio-about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Sobre Nosotros</h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Conoce nuestra misión, visión y valores que impulsan el éxito educativo
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="border-2 h-full">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                  <Building2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed text-muted-foreground">
                  Facilitar el proceso de gestión de pasantías mediante un sistema integral que conecta estudiantes,
                  instituciones educativas y centros de trabajo, garantizando una experiencia transparente, eficiente y
                  enriquecedora para todos los involucrados.
                </p>
                <Separator />
                <p className="leading-relaxed text-muted-foreground">
                  Nos comprometemos a ofrecer herramientas tecnológicas de vanguardia que simplifiquen la administración
                  académica y fortalezcan el vínculo entre la educación y el mundo laboral.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 h-full">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed text-muted-foreground">
                  Ser la plataforma líder en gestión de pasantías a nivel nacional e internacional, reconocida por su
                  innovación tecnológica, compromiso con la excelencia educativa y capacidad de transformar la
                  experiencia formativa de miles de estudiantes.
                </p>
                <Separator />
                <p className="leading-relaxed text-muted-foreground">
                  Aspiramos a facilitar el desarrollo profesional de los estudiantes y fortalecer las relaciones
                  estratégicas entre instituciones educativas y el sector empresarial.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 h-full">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl">Nuestros Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="font-semibold">Innovación</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground mt-1">
                      Implementamos tecnología de punta para ofrecer soluciones eficientes y actualizadas.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Transparencia</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground mt-1">
                      Garantizamos procesos claros y accesibles para todos los usuarios del sistema.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Compromiso</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground mt-1">
                      Dedicados al éxito académico y profesional de cada estudiante.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECCIÓN FOOTER */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-2xl font-bold">
                Pla<span className="text-primary">vet</span>
              </h3>
              <p className="mb-6 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                Sistema Integral de Gestión de Pasantías. Optimizando el proceso de pasantías y fortaleciendo el vínculo
                entre educación y trabajo desde 2025.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/ipisasdb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">Instagram</Button>
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@ipisa.edu.do</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1(809)-724-5700</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Santiago de los Caballeros, República Dominicana</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/images/logo_pisa.png" alt="IPISA Logo" className="h-6 object-contain bg-white rounded-sm p-0.5" />
              <p className="text-sm">&copy; 2025 Plavet. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>

  )
}