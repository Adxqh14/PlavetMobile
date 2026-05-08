import "../../../App.css"
import { AppSidebar } from "@/shared/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
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
import { Toaster } from "@/shared/components/ui/sonner"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"

export default function Main({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth()
  const breadcrumbs = useBreadcrumbs()

  const fullName = user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : user?.username ?? ''
  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U"




  return (
    <SidebarProvider>
      <div className="contents">
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

                {/* Inicio - Más Visible */}
                <BreadcrumbItem className="hidden md:block">
                  <span className="text-muted-foreground font-normal text-[13px] lowercase select-none tracking-normal">
                    inicio
                  </span>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block opacity-60">
                  <span className="text-[11px] mx-1.5 text-muted-foreground">/</span>
                </BreadcrumbSeparator>

                {/* Breadcrumb dinámico */}
                {breadcrumbs.map((bc, i) => (
                  <BreadcrumbItem key={i} className={i === 0 && breadcrumbs.length > 1 ? "hidden sm:flex" : "flex"}>
                    {bc.isLast ? (
                      <BreadcrumbPage className="font-bold text-foreground text-[13px] lowercase tracking-normal">{bc.label}</BreadcrumbPage>
                    ) : (
                      <span className="text-muted-foreground font-normal text-[13px] lowercase select-none tracking-normal">
                        {bc.label}
                      </span>
                    )}
                    {!bc.isLast && (
                      <BreadcrumbSeparator className="opacity-60">
                        <span className="text-[11px] mx-1.5 text-muted-foreground">/</span>
                      </BreadcrumbSeparator>
                    )}
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


      </SidebarInset>
      <Toaster richColors position="bottom-center" />
    </SidebarProvider>
  )
}
