import { cn } from "@/lib/utils"
import { Button } from "../../../shared/components/ui/button"
import { Card, CardContent } from "../../../shared/components/ui/card"
import { Input } from "../../../shared/components/ui/input"
import { Label } from "../../../shared/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useTour } from "../../../shared/hooks/useTour"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [cedula, setCedula] = useState("")
  const [password, setPassword] = useState("")

  useTour('tutorial_login', [
    { element: '#login-card', popover: { title: 'Acceso Seguro', description: 'Ingresa tus credenciales para administrar tus pasantías.', side: "top" } },
    { element: '#cedula-group', popover: { title: 'Tu Identidad', description: 'Usa tu número de cédula sin guiones.', side: "right" } },
    { element: '#password-group', popover: { title: 'Seguridad', description: 'Tu contraseña secreta.', side: "right" } },
    { element: '#btn-login', popover: { title: 'Adelante', description: 'Haz clic para entrar cuando estés listo.', side: "bottom" } },
  ], 500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mockup: Guardar usuario en localStorage
    const mockUser = {
      cedula,
      name: "Usuario Demo",
      role: "Estudiante",
    }
    localStorage.setItem('user', JSON.stringify(mockUser))
    sessionStorage.setItem('isLoggedIn', 'true')
    navigate("/dashboard")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card id="login-card" className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 md:top-6 md:left-6 h-8 w-8 text-muted-foreground hover:text-foreground transition-all hover:-translate-x-1 hover:bg-muted/50 rounded-full"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <img src="/images/Logo_Plavet_final-removebg-preview (1).png" alt="Plavet Logo" className="h-12 mb-4 object-contain" />
                <h1 className="text-2xl font-bold">
                  Bienvenido a Pla<span className="text-primary">vet</span>
                </h1>
                <p className="text-balance text-muted-foreground">
                  Sistema de Gestión de Pasantías y Empleabilidad
                </p>
              </div>
              <div id="cedula-group" className="grid gap-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="000-0000000-0"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  required
                />
              </div>
              <div id="password-group" className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button id="btn-login" type="submit" className="w-full">
                Login
              </Button>
              
            </div>
          </form>
          <div className="mt-auto">
            <img
              src="/images/Salesianos%20logo.png"
              alt="Plavet - Sistema de Gestión de Pasantías"
              className="max-h-[60%] w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{""}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
