import "../../../App.css"
import { AppSidebar } from "@/shared/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { Separator } from "@/shared/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { ModeToggle } from "../components/mode-toggle"
import { useBreadcrumbs } from "../../../shared/hooks/useBreadcrumbs"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Button } from "@/shared/components/ui/button"
import { useNavigate } from "react-router-dom"   
import { Toaster } from "@/shared/components/ui/sonner"
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react"   
import { useTour } from "../../../shared/hooks/useTour"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"

export default function Main({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth()
  const breadcrumbs = useBreadcrumbs()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const navigate = useNavigate()

  const fullName = user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : user?.username ?? ''
  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U"

  useTour('tutorial_main_layout', [
    { element: '#tour-sidebar', popover: { title: 'Navegación Principal', description: 'Aquí encuentras todos los módulos del sistema organizados por categorías.', side: "right", align: 'start' } },
    { element: '#tour-notifications', popover: { title: 'Notificaciones', description: 'Mantente al tanto de evaluaciones, documentos pendientes y alertas importantes.', side: "bottom" } },

  ], 800);

  const exampleNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Evaluación Completada',
      message: 'La evaluación de Juan Pérez ha sido enviada exitosamente.',
      time: 'Hace 5 minutos',
      icon: CheckCircle,
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pasantía por Vencer',
      message: 'La pasantía de María González vence en 3 días.',
      time: 'Hace 1 hora',
      icon: AlertCircle,
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Nuevo Documento Disponible',
      message: 'Se ha actualizado el manual de procedimientos.',
      time: 'Hace 2 horas',
      icon: Info,
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Reporte Generado',
      message: 'El reporte mensual está listo para descargar.',
      time: 'Ayer',
      icon: CheckCircle,
      read: true
    }
  ]

  const handleInicioClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowConfirmDialog(true)
  }

  const handleConfirmNavigation = () => {
    navigate("/")
  } 

  return (
    <SidebarProvider>
      <div id="tour-sidebar" className="contents">
        <AppSidebar />
      </div>
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 md:px-8">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <Breadcrumb>
              <BreadcrumbList>

                {/* Inicio */}
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink 
                    href="/" 
                    className="text-foreground hover:text-foreground cursor-pointer"
                    onClick={handleInicioClick}
                  >
                    Inicio
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                {/* Breadcrumb dinámico */}
                {breadcrumbs.map((bc, i) => (
                  <BreadcrumbItem key={i} className={i === 0 && breadcrumbs.length > 1 ? "hidden sm:flex" : "flex"}>
                    {bc.isLast ? (
                      <BreadcrumbPage>{bc.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={bc.href}
                        className="text-foreground hover:text-primary cursor-pointer transition-colors"
                        onClick={(e) => {
                          if (bc.href) {
                            e.preventDefault();
                            navigate(bc.href);
                          }
                        }}
                      >
                        {bc.label}
                      </BreadcrumbLink>
                    )}
                    {!bc.isLast && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                ))}

              </BreadcrumbList>
            </Breadcrumb>

            <div className="grow" />
          
           
          </div>
        </header>
        <div className="absolute top-4 right-4 md:right-8 flex items-center gap-2 md:gap-3">
          
          {/* 1. Theme Toggle */}
          <ModeToggle/>

          <Separator orientation="vertical" className="h-5 opacity-30" />

          {/* 2. Notifications */}
          <Popover>
            <PopoverTrigger>
              <Button 
                id="tour-notifications"
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 rounded-full hover:bg-muted/80 transition-colors"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-background shadow-sm"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0 rounded-2xl shadow-xl border-border/50 overflow-hidden" align="end" sideOffset={8}>
              <div className="px-4 py-3 border-b border-border/50 bg-muted/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Notificaciones</h4>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">2 no leídas</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-muted/50 transition-colors">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-background">
                {exampleNotifications.map((notification) => {
                  const IconComponent = notification.icon
                  const isUnread = !notification.read
                  
                  return (
                    <div
                      key={notification.id}
                      className={`group p-3.5 border-b border-border/50 cursor-pointer transition-all hover:bg-muted/30 ${
                        isUnread ? 'bg-primary/5' : 'opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 border shadow-xs transition-transform group-hover:scale-105 ${
                          notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          notification.type === 'warning' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                          'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        }`}>
                          <IconComponent className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-[13px] truncate ${isUnread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                              {notification.title}
                            </p>
                            {isUnread && (
                              <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0 shadow-sm shadow-primary/40"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1.5">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="p-2 bg-muted/10 border-t border-border/50">
                <Button variant="ghost" className="w-full text-[11px] font-bold uppercase tracking-wider text-primary h-8 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                  Ver historial
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-5 opacity-30" />

          {/* 3. User Account */}
          <div className="flex items-center gap-3 pl-1 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold leading-none text-foreground">{fullName || user?.username}</span>
              <span className="text-[10px] font-medium text-muted-foreground leading-tight mt-1">{user?.email}</span>
            </div>
            <Avatar className="h-9 w-9 rounded-full ring-2 ring-primary/10 transition-all hover:ring-primary/30 shadow-sm">
              <AvatarImage src={undefined} alt={fullName || user?.username} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>


        <main className="px-4 py-6 md:px-8 md:py-8 min-w-0 overflow-x-hidden">
          {children}
        </main>

        {/* Confirmation Dialog for Inicio */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                ¿Regresar a la página principal?
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                ¿Está seguro que desea regresar a la página principal? Perderá cualquier progreso no guardado en la página actual.
              </p>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmNavigation}
                  className="flex-1"
                >
                  Regresar al Inicio
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
      <Toaster richColors position="bottom-center" />
    </SidebarProvider>
  )
}
