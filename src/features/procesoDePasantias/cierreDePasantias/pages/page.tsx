"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Download,
  RotateCcw,

} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import Main from "@/features/main/pages/page";

import { useCierrePasantias } from "../hooks/useCierrePasantias";
import { CierreStatsCards } from "../components/CierreStatsCards";
import { CierreProgress } from "../components/CierreProgress";
import { AuthPasswordDialog } from "../components/AuthPasswordDialog";


export default function CierrePasantiasPage() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);


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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-600/10">
                <RotateCcw className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Cierre de Pasantías</h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Proceso completo de cierre y reinicio del sistema de pasantías
            </p>
          </div>

          {/* Stats Cards */}
          <CierreStatsCards stats={stats} />

          {/* Main Content */}
          <Card className="border">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExport}
                    className="gap-2 bg-transparent"
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4" />
                    {isExporting ? "Exportando..." : "Exportar"}
                  </Button>
                  {process && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetProcess}
                      className="gap-2 bg-transparent"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reiniciar
                    </Button>
                  )}

                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Progress Component */}
              <CierreProgress
                currentStep={currentStep}
                getStepProgress={getStepProgress}
                getStepStatus={getStepStatus}
                process={process}
              />

              {/* Warning Section */}
              {!process && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                  <p className="text-sm text-red-900 dark:text-red-300 font-medium">
                    Esta acción es irreversible y afectará a todos los registros del sistema. Por favor, asegúrese de
                    realizar un respaldo antes de continuar.
                  </p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-300 mb-1">
                        Error en el Proceso
                      </h4>
                      <p className="text-sm text-red-800 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Display */}
              {process && !hasErrors && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <div className="flex items-start gap-3">
                    <RotateCcw className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-900 dark:text-emerald-300 mb-1">
                        Proceso Completado Exitosamente
                      </h4>
                      <p className="text-sm text-emerald-800 dark:text-emerald-400">
                        Se procesaron {totalProcessed} registros correctamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button 
                size="lg" 
                className="w-full bg-red-600 hover:bg-red-700 text-white" 
                disabled={isProcessing || (process !== null)}
                onClick={handleAuthClick}
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                {isProcessing ? "Procesando..." : process ? "Proceso Ejecutado" : "Iniciar Cierre de Pasantías"}
              </Button>

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
