"use client"

import * as React from "react"
import {
  FileSearchCorner,
  LifeBuoy,
  Send,
  Settings2,
  BookMarked,
  LayoutDashboard,
  Building2,
  UserSearch,
  ClipboardCheck,
  FileText,
  LogOut
} from "lucide-react"

import { NavMain } from "../components/nav-main"
import { NavSecondary } from "../components/nav-secondary"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { isNavVisible } from "@/shared/config/rbac"
import { Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,

    },
    {
      title: "Gestion Academica",
      url: "#",
      icon: BookMarked,
      items: [
        {
          title: "Estudiantes",
          url: "/estudiantes",
        },
        {
          title: "Talleres",
          url: "/talleres",
        },
        {
          title: "Tutores",
          url: "/tutoresAcademicos",
        },
      ],
    },
    {
      title: "Gestion Empresarial",
      url: "#",
      icon: Building2,
      items: [
        {
          title: "Centros de Trabajo",
          url: "/centroDeTrabajo",
        },
        {
          title: "Plazas",
          url: "/plaza",
        },
        {
          title: "Tutores Empresariales",
          url: "/tutoresEmpresariales",
        },
      ],
    },
    {
      title: "Roles y Personal",
      url: "#",
      icon: UserSearch,
      items: [
        {
          title: "Supervisores",
          url: "/supervisores",
        },
        {
          title: "Vinculadores",
          url: "/vinculadores",
        },
        {
          title: "Usuarios",
          url: "/usuarios",
        }
      ],
    },
    {
      title: "Documentacion",
      url: "#",
      icon: FileSearchCorner,
      items: [
        {
          title: "Documentos",
          url: "/documentos",
        },
        {
          title: "Subir Documentos",
          url: "/subir",
        },
        {
          title: "Mis Documentos",
          url: "/mis-documentos",
        }
      ],
    },
    {
      title: "Evaluaciones",
      url: "#",
      icon: ClipboardCheck,
      items: [
        {
          title: "Evaluaciones",
          url: "/evaluaciones",
        },
        {
          title: "Calificaciones",
          url: "/calificaciones",
        },
        {
          title: "Mis Calificaciones",
          url: "/mis-calificaciones",
        }
      ],
    },
    {
      title: "Proceso de Pasantias",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Gestion de Pasantias",
          url: "/gestionDePasantias",
        },
        {
          title: "Cierre de Pasantias",
          url: "/cierrePasantias",
        },
        {
          title: "Registro de Asistencias",
          url: "/asistencias",
        },
        {
          title: "Registro de Visitas",
          url: "/visitas",
        },
        {
          title: "Enviar Excusas",
          url: "/excusas",
        }
      ],
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Ayuda",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userRole } = useAuth();

  // Filtrar los items de navegación según el rol del usuario
  const filteredNavMain = data.navMain
    .map((group) => {
      // Primero filtramos los sub-items si existen
      let filteredItems = group.items;

      if (group.items) {
        filteredItems = group.items.filter((item) => isNavVisible(userRole, item.title));
      }

      return { ...group, items: filteredItems };
    })
    .filter((group) => {
      // Si el grupo no tiene items y no es Dashboard o Reportes, lo ocultamos
      if (group.title === "Dashboard" || group.title === "Reportes") {
        return isNavVisible(userRole, group.title);
      }
      return group.items && group.items.length > 0;
    });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden bg-white/10">
                  <img src="/images/Logo_Plavet_final-removebg-preview (1).png" alt="Plavet Logo" className="w-full h-full object-contain p-1" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Plavet</span>
                  <span className="truncate text-xs">Salesianos Antillas</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-9 rounded-lg transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 group border border-transparent hover:border-red-500/10">
              <a href="/login" className="flex items-center gap-2.5 px-2 w-full">
                <div className="flex items-center justify-center h-6 w-6 rounded-md bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  <LogOut className="h-3 w-3" />
                </div>
                <span className="font-medium text-[9px] uppercase tracking-[0.15em] transition-colors">
                  Cerrar Sesión
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}