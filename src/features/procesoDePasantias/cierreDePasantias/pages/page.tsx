"use client";

import { useState } from "react";
import {
  AlertTriangle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../shared/components/ui/alert-dialog";
import { Button } from "../../../../shared/components/ui/button";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import Main from "@/features/main/pages/page";

import { useCierrePasantias } from "../hooks/useCierrePasantias";
import { CierreStatsCards } from "../components/CierreStatsCards";
import { CierreProgress } from "../components/CierreProgress";
import { AuthPasswordDialog } from "../components/AuthPasswordDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CierreHero } from "../components/CierreHero";
import { CierreActionBar } from "../components/CierreActionBar";
import { CierreStatusHeader } from "../components/CierreStatusHeader";

export default function CierrePasantiasPage() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
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

  const handleConfirmAction = () => {
    setIsConfirmDialogOpen(false);
    if (isAuthEnabled) {
      setIsAuthDialogOpen(true);
    } else {
      handleClosureProcess("");
    }
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <CierreHero userRole={userRole} userTaller={user?.taller} />

        <div className="w-full pb-12 px-6 md:px-12">
          <CierreActionBar 
            onExport={exportAndDownload}
            isExporting={isExporting}
            onReset={resetProcess}
            showReset={!!process}
          />

          <CierreStatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <CierreStatusHeader />
            </CardHeader>
            <CardContent className="p-6">
              <CierreProgress
                currentStep={currentStep}
                getStepProgress={getStepProgress}
                getStepStatus={getStepStatus}
                process={process}
              />

              {error && (
                <div className="mt-8 p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-900 mb-1">Error en el Proceso</h4>
                      <p className="text-sm text-rose-800 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {process && !hasErrors && (
                <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <RotateCcw className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-bold text-emerald-900 mb-1">Proceso Completado Exitosamente</h4>
                      <p className="text-sm text-emerald-800 font-medium">
                        Se procesaron <span className="font-bold">{totalProcessed}</span> registros correctamente y el sistema ha sido reiniciado.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 flex justify-end">
                <Button 
                  size="default" 
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-none" 
                  disabled={isProcessing || (process !== null)}
                  onClick={() => setIsConfirmDialogOpen(true)}
                >
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isProcessing ? "PROCESANDO CIERRE..." : process ? "PROCESO EJECUTADO" : "Ejecutar Cierre de Período"}
                </Button>
              </div>

              <AuthPasswordDialog
                open={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
                onConfirm={handleClosureProcess}
                isLoading={isProcessing}
              />

              <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent className="rounded-2xl border-rose-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black text-rose-600 flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6" />
                      Advertencia Crítica
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-muted-foreground font-medium leading-relaxed">
                      Esta acción es <span className="text-rose-600 font-bold">irreversible</span> y afectará a todos los registros del sistema.
                      Se eliminarán las vinculaciones actuales para iniciar un nuevo período académico.
                      <br /><br />
                      ¿Está seguro de que desea continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-4 gap-2">
                    <AlertDialogCancel className="rounded-xl font-bold border-muted-foreground/20">
                      Cancelar y Revisar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleConfirmAction}
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
                    >
                      Sí, deseo continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}
