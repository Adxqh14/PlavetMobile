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
  FileText
} from "lucide-react"

import { NavMain } from "../components/nav-main"
import { NavSecondary } from "../components/nav-secondary"
import { NavUser } from "../components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
      title: "Gestion Institucional",
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
  // Mock role para desarrollo (idealmente vendría de un hook de autenticación, ej: useAuth)
  const userRole = "ESTUDIANTE";

  // Filtrar los items de navegación según el rol del usuario
  const filteredNavMain = data.navMain
    .map((group) => {
      // Primero filtramos los sub-items si existen
      let filteredItems = group.items;

      if (group.items) {
        filteredItems = group.items.filter((item) => {
          // Restricciones específicas para ESTUDIANTE
          if (userRole === "ESTUDIANTE") {
            const allowedForStudent = ["Mis Documentos", "Subir Documentos", "Mis Calificaciones", "Enviar Excusas"];
            return allowedForStudent.includes(item.title);
          }

          // Restricciones previas para otros roles
          if (item.title === "Cierre de Pasantias") {
            return ["ADMINISTRADOR", "VINCULADOR"].includes(userRole);
          }
          return true;
        });
      }

      return { ...group, items: filteredItems };
    })
    .filter((group) => {
      // Si es ESTUDIANTE, solo mostramos Dashboard y grupos que tengan items permitidos
      if (userRole === "ESTUDIANTE") {
        if (group.title === "Dashboard") return true;
        return group.items && group.items.length > 0;
      }

      // Para otros roles, podrías agregar lógica similar si deseas ocultar grupos vacíos
      return true;
    });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden bg-white/10">
                  <img src="/images/Logo_Plavet_final-removebg-preview (1).png" alt="Plavet Logo" className="w-full h-full object-contain p-1" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Plavet</span>
                  <span className="truncate text-xs">Salesianos Antillas</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}