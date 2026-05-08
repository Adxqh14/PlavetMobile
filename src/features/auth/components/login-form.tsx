import { cn } from "@/lib/utils"
import { Button } from "../../../shared/components/ui/button"
import { Card, CardContent } from "../../../shared/components/ui/card"
import { Input } from "../../../shared/components/ui/input"
import { Label } from "../../../shared/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { authService } from "../services/authService"
import { AuthContext } from "../context/AuthContextInstance"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const [cedula, setCedula] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const sanitizedCedula = cedula.replace(/\D/g, '')
      const response = await authService.login({ cedula: sanitizedCedula, password })

      // Actualizar el contexto con el usuario real del backend
      if (authContext) {
        authContext.setUser(response.user);
      }

      // Persistir en localStorage para recargas de página
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('tenant', response.user.tenant)
      sessionStorage.setItem('isLoggedIn', 'true')

      navigate("/dashboard")
    } catch (err) {
      const error = err as { message?: string }
      setError(error.message || "Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
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
              {error && (
                <div className="text-sm font-medium text-destructive text-center">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cargando..." : "Iniciar Sesión"}
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
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-foreground mt-2">
        Al hacer clic en continuar, aceptas nuestros <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  )
}
