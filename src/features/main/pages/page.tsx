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

export default function Main({ children }: { children?: React.ReactNode }) {
  const breadcrumbs = useBreadcrumbs()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const navigate = useNavigate()

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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
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
                  <BreadcrumbItem key={i}>
                    {bc.isLast ? (
                      <BreadcrumbPage>{bc.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={bc.href} className="text-foreground hover:text-foreground">
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
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <Button 
                id="tour-notifications"
                variant="outline" 
                size="sm" 
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Notificaciones</h4>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Tienes 2 notificaciones no leídas
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {exampleNotifications.map((notification) => {
                  const IconComponent = notification.icon
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'success' ? 'bg-green-100 text-green-600' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full shrink-0"></span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>

          <ModeToggle/>
        </div>

        <main className="p-6 md:p-10">
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
