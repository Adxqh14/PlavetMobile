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
  LogIn,
} from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ModeToggle } from "../../main/components/mode-toggle"
import { useTour } from "../../../shared/hooks/useTour"


export default function InicioPage() {
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

  return (

    <div className="min-h-screen bg-background">
      {/* Header Transparente */}
      <header id="tour-inicio-header" className="flex justify-end items-center px-6 py-4 absolute top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </header>
      <section
        id="tour-inicio-welcome"
        className="border-b relative overflow-hidden min-h-screen flex flex-col justify-center bg-background" >
        
        {/* Static Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/images/bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-50 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-background/30 dark:bg-background/70" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-16 lg:py-24 relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            
            <Badge variant="outline" className="mb-8 uppercase tracking-[0.25em] text-[10px] md:text-xs font-black border-primary/30 bg-primary/5 text-primary py-2 px-6 rounded-full shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Sistema de Gestión de Pasantías y Empleabilidad
            </Badge>

            <h1 className="mb-8 text-balance text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
              <span className="text-foreground">Bienvenido a</span> Pla<span className="text-primary drop-shadow-[0_0_25px_rgba(var(--primary),0.4)]">vet</span>
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-pretty text-lg md:text-2xl font-semibold text-foreground/80 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both drop-shadow-sm">
              La plataforma integral que revoluciona el proceso de pasantías. Conectamos talento estudiantil, instituciones educativas y centros de trabajo en un ecosistema digital único.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
              <Button size="lg" className="w-full sm:w-auto h-14 rounded-full px-10 font-bold text-base shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 relative overflow-hidden group/btn" onClick={() => navigate('/login')}>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
                <LogIn className="relative mr-2.5 h-5 w-5 z-10" />
                <span className="relative z-10">Iniciar Sesión</span>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 rounded-full px-10 font-bold text-base border-2 hover:bg-muted transition-all group/outline" onClick={() => {
                document.getElementById('tour-inicio-features')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explorar Plataforma
                <Briefcase className="ml-2.5 h-5 w-5 transition-transform group-hover/outline:translate-x-1" />
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