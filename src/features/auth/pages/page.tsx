import { LoginForm } from "../components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
      <div className="w-full max-w-sm md:max-w-4xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out">
        <LoginForm />
      </div>
    </div>
  )
}
