"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Download,
  RotateCcw,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import Main from "@/features/main/pages/page";

import { useCierrePasantias } from "../hooks/useCierrePasantias";
import { CierreStatsCards } from "../components/CierreStatsCards";
import { CierreProgress } from "../components/CierreProgress";
import { AuthPasswordDialog } from "../components/AuthPasswordDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";


export default function CierrePasantiasPage() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { userRole, user } = useAuth();

  const {
    isProcessing,
    currentStep,
    process,
    error,
    isExporting,
    stats,
    hasErrors,
    totalProcessed,
    isAuthEnabled,
    executeCierreWithAuth,
    exportAndDownload,
    resetProcess,
    getStepProgress,
    getStepStatus,
  } = useCierrePasantias();

  const handleClosureProcess = async (password: string) => {
    const success = await executeCierreWithAuth(password);
    if (success) {
      setIsAuthDialogOpen(false);
      alert("Cierre de pasantías completado exitosamente.");
    } else {
      alert("Ocurrieron errores durante el proceso de cierre.");
    }
  };

  const handleAuthClick = () => {
    if (isAuthEnabled) {
      setIsAuthDialogOpen(true);
    } else {
      // Si la autenticación está deshabilitada, ejecutar directamente
      handleClosureProcess("");
    }
  };

  const handleExport = async () => {
    const success = await exportAndDownload();
    if (success) {
      // Success feedback could be added here
    }
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-rose-500/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <RotateCcw className="w-80 h-80 text-rose-600 -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Cierre de <span className="text-rose-600">Pasantías</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Proceso crítico de finalización y reinicio del ciclo académico de pasantías para la gestión de nuevos períodos.
              </p>
              {userRole === "TUTOR ACADEMICO" && user?.taller && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary border border-primary/20">
                  <User className="h-4 w-4" />
                  <span>Taller: {user.taller.nombre}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-rose-600 pl-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground">Proceso de Finalización</h2>
              <p className="text-muted-foreground font-medium text-sm">Resumen operativo y ejecución de cierre masivo</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exportando..." : "Exportar Datos"}
              </Button>
              {process && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetProcess}
                  className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar Vista
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <CierreStatsCards stats={stats} />

          {/* Main Content */}
          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-600/10">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Estado del Proceso</h3>
                  <p className="text-xs text-muted-foreground font-medium">Control de pasos secuenciales para el cierre definitivo</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Warning Section */}
              {!process && (
                <div className="flex items-start gap-3 mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl">
                  <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-1">Advertencia Crítica</h4>
                    <p className="text-sm text-rose-800 font-medium leading-relaxed">
                      Esta acción es irreversible y afectará a todos los registros del sistema. Por favor, asegúrese de
                      realizar un respaldo antes de continuar.
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Component */}
              <CierreProgress
                currentStep={currentStep}
                getStepProgress={getStepProgress}
                getStepStatus={getStepStatus}
                process={process}
              />

              {/* Error Display */}
              {error && (
                <div className="mt-8 p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-900 mb-1">
                        Error en el Proceso
                      </h4>
                      <p className="text-sm text-rose-800 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Display */}
              {process && !hasErrors && (
                <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <RotateCcw className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-bold text-emerald-900 mb-1">
                        Proceso Completado Exitosamente
                      </h4>
                      <p className="text-sm text-emerald-800 font-medium">
                        Se procesaron <span className="font-bold">{totalProcessed}</span> registros correctamente y el sistema ha sido reiniciado.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-10">
                <Button 
                  size="lg" 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white h-14 rounded-xl font-black text-lg shadow-lg shadow-rose-200" 
                  disabled={isProcessing || (process !== null)}
                  onClick={handleAuthClick}
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <AlertTriangle className="mr-2 h-6 w-6" />
                  )}
                  {isProcessing ? "PROCESANDO CIERRE..." : process ? "PROCESO EJECUTADO" : "INICIAR CIERRE DEFINITIVO"}
                </Button>
              </div>

              {/* Auth Dialog */}
              <AuthPasswordDialog
                open={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
                onConfirm={handleClosureProcess}
                isLoading={isProcessing}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}
