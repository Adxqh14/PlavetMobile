"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()

  // 1. Estado para los menús abiertos (máximo 3)
  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    const initialMenus = items
      .filter((item) => item.isActive || item.items?.some((sub) => sub.url === window.location.pathname))
      .map((item) => item.title)
      .slice(0, 3)
    
    return initialMenus
  })

  // 2. Definimos handleToggle ANTES del useEffect para evitar el error de "acceso antes de declaración"
  // Usamos useCallback para que la función sea estable y ESLint no se queje
  const handleToggle = useCallback((title: string) => {
    setOpenMenus((prev) => {
      if (prev.includes(title)) {
        return prev.filter((t) => t !== title) // Cerrar manualmente
      }
      const next = [...prev, title]
      return next.length > 3 ? next.slice(1) : next // FIFO: máximo 3
    })
  }, [])

  // 3. Efecto para abrir el menú automáticamente cuando navegas a una sub-ruta
  useEffect(() => {
    items.forEach((item) => {
      const isSubItemActive = item.items?.some((sub) => sub.url === location.pathname)
      
      // Si estamos en una ruta de este módulo y el módulo está cerrado, lo abrimos
      if (isSubItemActive && !openMenus.includes(item.title)) {
        handleToggle(item.title)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, items, handleToggle]) 
  // Nota: openMenus no se pone aquí para evitar bucles infinitos, 
  // usamos el comentario de arriba para silenciar la advertencia de dependencias de forma segura.

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Modulos</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = openMenus.includes(item.title)
          const isModuleActive = location.pathname === item.url || 
                                 item.items?.some(sub => sub.url === location.pathname)

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={() => handleToggle(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  {!item.items?.length ? (
                    <Link to={item.url}>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        isActive={isModuleActive}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  ) : (
                    <SidebarMenuButton 
                      tooltip={item.title}
                      isActive={isModuleActive}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>

                      {item.items?.length ? (
                        <ChevronRight
                          className={`ml-auto transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                      ) : null}
                    </SidebarMenuButton>
                  )}
                </CollapsibleTrigger>

                {item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={location.pathname === subItem.url}
                          >
                            {/* ELIMINAMOS <a> Y USAMOS <Link> DE REACT-ROUTER-DOM */}
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}