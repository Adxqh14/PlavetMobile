import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shared/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../shared/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user?: {
    name: string
    email: string
    cedula?: string
    avatar?: string
  }
}) {
  // Resolver el usuario: preferir la prop `user`, pero si no está disponible
  // (p. ej. el contexto aún no se actualizó al navegar tras el login),
  // intentar cargar el usuario desde localStorage donde el login lo persiste.
  let resolvedUser = user
  if (!resolvedUser) {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        resolvedUser = JSON.parse(stored)
      }
    } catch {
      // ignore parse errors
    }
  }

  if (!resolvedUser) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const initials = getInitials(resolvedUser.name ?? "")
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={resolvedUser.avatar} alt={resolvedUser.name} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{resolvedUser.name}</span>
                <span className="truncate text-xs">{resolvedUser.cedula || resolvedUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={resolvedUser.avatar} alt={resolvedUser.name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{resolvedUser.name}</span>
                  <span className="truncate text-xs">{resolvedUser.cedula || resolvedUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOut />
                <a href="/login">Log out</a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
