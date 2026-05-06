"use client"

import { 
  BarChart3, 
  PieChart, 
  Loader2, 
  Star,
  Download,
  X
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Chart as ChartJS } from 'chart.js'
import { ReporteService } from "../service/reporteService"
import { ReportSummaryCards } from "./ReportSummaryCards"
import { ReportDataTable } from "./ReportDataTable"
import { MemoizedAreaChart, MemoizedPieChart } from "./ReportCharts"
import { Button } from "../../../shared/components/ui/button"
import { Badge } from "../../../shared/components/ui/badge"

interface ReportPreviewProps {
  reportType: string
  filters: {
    taller: string
    periodo: string
    formato: string
  }
  onClose: () => void
}

interface DashboardData {
  title: string;
  summary: Record<string, number | string>;
  chartData: { name: string; [key: string]: number | string }[];
  pieData: { name: string; value: number; color: string }[];
  tableData?: Record<string, number | string>[];
}

export const ReportPreview = ({ reportType, filters, onClose }: ReportPreviewProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [reportData, setReportData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  
  const areaChartRef = useRef<ChartJS<'line'>>(null)
  const pieChartRef = useRef<ChartJS<'pie'>>(null)

  useEffect(() => {
    // Bloquear scroll del body al abrir el informe
    document.body.style.overflow = 'hidden'
    
    const loadReportData = async () => {
      try {
        setLoading(true)
        const data = await ReporteService.getReporteData(reportType, filters.taller)
        setReportData(data)
      } catch (error) {
        console.error("Error loading report data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadReportData()

    // Restaurar scroll al cerrar
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [reportType, filters.taller])
  
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const { pdf } = await import("@react-pdf/renderer")
      const { ReportPDF } = await import("./ReportPDF")
      if (!reportData) return
      
      const areaChartImage = areaChartRef.current?.toBase64Image()
      const pieChartImage = pieChartRef.current?.toBase64Image()
      
      const doc = <ReportPDF 
        data={reportData} 
        tallerName={filters.taller === 'todos' ? 'Institucional' : filters.taller}
        periodo={filters.periodo}
        charts={{ area: areaChartImage, pie: pieChartImage }}
      />
      
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Reporte_Plavet_Dashboard.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al generar PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    )
  }
  
  if (!reportData) return null

  return (
    <div className="fixed inset-0 bg-background/40 backdrop-blur-md z-50 flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="bg-card border-x md:border-2 shadow-2xl md:rounded-[2.5rem] w-full max-w-[98vw] h-full md:h-[95vh] flex flex-col animate-in fade-in zoom-in duration-500">
        
        {/* Header Compacto */}
        <div className="shrink-0 px-6 py-4 md:py-6 border-b bg-muted/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black tracking-tight leading-none mb-1">{reportData.title}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-md font-bold uppercase text-[9px] px-1.5 py-0">
                  {filters.taller === 'todos' ? 'Global' : filters.taller}
                </Badge>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{filters.periodo}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="rounded-lg font-bold bg-primary h-9 px-4 text-xs">
              {isGeneratingPDF ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Download className="h-3 w-3 mr-2" />}
              Descargar PDF
            </Button>
            <Button variant="outline" size="icon" onClick={onClose} className="rounded-lg h-9 w-9 border-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Grid - Ocupa todo el espacio sin scroll */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda: KPIs y Tabla Detallada */}
          <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
            <ReportSummaryCards summary={reportData.summary} />
            
            <div className="flex-1 min-h-0 p-6 bg-white dark:bg-slate-950 rounded-3xl border shadow-sm flex flex-col">
              <h4 className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Star className="h-3 w-3 text-primary" /> Detalle Institucional Extendido
              </h4>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <ReportDataTable data={reportData.tableData} />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Distribución y Tendencias Compactas */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
            <div className="h-[40%] min-h-0 p-6 bg-white dark:bg-slate-950 rounded-3xl border shadow-sm flex flex-col">
              <h4 className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <PieChart className="h-3 w-3 text-primary" /> Distribución Global
              </h4>
              <div className="flex-1 min-h-0 w-full">
                <MemoizedPieChart ref={pieChartRef} data={reportData.pieData} showLabels={isGeneratingPDF} />
              </div>
            </div>

            <div className="flex-1 min-h-0 p-6 bg-white dark:bg-slate-950 rounded-3xl border shadow-sm flex flex-col">
              <h4 className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="h-3 w-3 text-primary" /> Tendencias de Inteligencia
              </h4>
              <div className="flex-1 min-h-0 w-full">
                <MemoizedAreaChart ref={areaChartRef} data={reportData.chartData} showLabels={isGeneratingPDF} />
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer Minimalista */}
        <div className="shrink-0 px-6 py-3 border-t bg-muted/5 flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-30">
            <div className="h-4 w-4 rounded bg-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest">PLAVET INTELLIGENCE v2.0</span>
          </div>
          <p className="text-[8px] font-bold text-muted-foreground uppercase">
            Certificado Institucional &copy; 2024
          </p>
        </div>
      </div>
    </div>
  )
}
