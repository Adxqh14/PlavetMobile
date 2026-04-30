// ==========================================
// Componente de Vista Previa de Reportes con Gráficos
// ==========================================

"use client"

import { 
  BarChart3, 
  PieChart, 
  FileText, 
  Calendar, 
  Filter, 
  Share2, 
  Loader2, 
  Building2, 
  Star,
  Download,
  X
} from "lucide-react"
import { useState, useEffect } from "react"
import { ReporteService } from "../service/reporteService"
import { ReportHeader } from "./ReportHeader"
import { ReportSummaryCards } from "./ReportSummaryCards"
import { ReportDataTable } from "./ReportDataTable"
import { MemoizedAreaChart, MemoizedPieChart } from "./ReportCharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/components/ui/select"

interface ReportPreviewProps {
  reportType: string
  filters: {
    taller: string
    periodo: string
    formato: string
  }
  onClose: () => void
}

interface ChartDataPoint {
  name: string
  [key: string]: string | number
}

interface PieDataPoint {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

interface TableDataPoint {
  [key: string]: string | number
}

interface ReportData {
  title: string
  icon?: string
  summary: Record<string, number | string>
  chartData: ChartDataPoint[]
  pieData: PieDataPoint[]
  tableData?: TableDataPoint[]
}

const talleresDisponibles = [
  { id: "desarrollo-web", nombre: "Desarrollo Web" },
  { id: "ebanisteria", nombre: "Ebanistería" },
  { id: "electronica", nombre: "Electrónica" },
  { id: "mecanizado", nombre: "Mecanizado" },
  { id: "automotriz", nombre: "Automotriz" },
  { id: "contabilidad", nombre: "Contabilidad" },
]

export const ReportPreview = ({ reportType, filters, onClose }: ReportPreviewProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showTallerSelector, setShowTallerSelector] = useState(true)
  const [selectedTaller, setSelectedTaller] = useState(filters.taller || "")
  const [currentPeriodo, setCurrentPeriodo] = useState(filters.periodo || "2024")
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Precarga de librerías pesadas en segundo plano para que estén listas al exportar
    const prefetchLibs = () => {
      import("jspdf");
      import("dom-to-image");
    };
    
    const loadReportData = async () => {
      try {
        setLoading(true)
        const data = await ReporteService.getReporteData(reportType)
        setReportData(data)
        prefetchLibs(); // Iniciar precarga tras cargar los datos básicos
      } catch (error) {
        console.error("Error loading report data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadReportData()
  }, [reportType])
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Preparando informe estratégico...</p>
        </div>
      </div>
    )
  }
  
  if (!reportData) return null

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Importación dinámica de librerías pesadas solo cuando se necesitan
      const [jsPDFModule, domtoimageModule] = await Promise.all([
        import("jspdf"),
        import("dom-to-image")
      ]);
      
      const jsPDF = jsPDFModule.default;
      const domtoimage = domtoimageModule.default;

      const element = document.getElementById('report-preview-content')
      if (!element) return
      
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1.0,
        bgcolor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      })
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      const img = new Image()
      img.src = dataUrl
      
      await new Promise((resolve) => { img.onload = resolve })
      
      const imgWidth = pdfWidth
      const imgHeight = (img.height * pdfWidth) / img.width
      
      if (imgHeight <= pdfHeight) {
        pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight)
      } else {
        const totalPages = Math.ceil(imgHeight / pdfHeight)
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) pdf.addPage()
          const yOffset = -(i * pdfHeight)
          pdf.addImage(dataUrl, 'PNG', 0, yOffset, imgWidth, imgHeight)
        }
      }
      
      pdf.save(`${reportData.title.replace(/\s+/g, '_')}_${selectedTaller || 'general'}.pdf`)
      
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const Icon = reportData.icon ? FileText : FileText

  return (
    <div className="fixed inset-0 bg-background/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card border shadow-2xl rounded-3xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header Superior */}
        <div className="shrink-0 px-8 py-6 border-b bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{reportData.title}</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Filter className="h-3 w-3" />
                  {selectedTaller ? talleresDisponibles.find(t => t.id === selectedTaller)?.nombre : "Global"}
                </span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Calendar className="h-3 w-3" />
                  Período: {currentPeriodo}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!showTallerSelector && (
              <Button variant="outline" size="sm" onClick={() => setShowTallerSelector(true)} className="rounded-xl font-bold">
                Cambiar Filtros
              </Button>
            )}
            <Button 
              onClick={handleDownloadPDF} 
              disabled={isGeneratingPDF || showTallerSelector} 
              className="rounded-xl font-bold bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              {isGeneratingPDF ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Exportar PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Área de Contenido */}
        <div className="flex-1 overflow-y-auto bg-muted/5">
          {showTallerSelector ? (
            <div className="p-12 text-center max-w-4xl mx-auto">
              <h3 className="text-3xl font-extrabold mb-2">Configura tu Reporte</h3>
              <p className="text-muted-foreground mb-8 text-lg">Selecciona los parámetros específicos para la generación de datos.</p>
              
              {/* Filtros arriba */}
              <div className="flex justify-center gap-4 mb-10 pb-8 border-b">
                <div className="w-48 text-left">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block ml-1">Periodo</label>
                  <Select value={currentPeriodo} onValueChange={setCurrentPeriodo}>
                    <SelectTrigger className="rounded-xl h-11 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">Ciclo 2024</SelectItem>
                      <SelectItem value="2023">Ciclo 2023</SelectItem>
                      <SelectItem value="todos">Histórico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    size="lg" 
                    className="h-11 rounded-xl px-8 font-bold"
                    disabled={!selectedTaller}
                    onClick={() => setShowTallerSelector(false)}
                  >
                    Generar Análisis
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {talleresDisponibles.map((taller) => (
                  <Card 
                    key={taller.id}
                    className={`cursor-pointer group transition-all duration-300 rounded-2xl border-2 ${
                      selectedTaller === taller.id ? 'border-primary bg-primary/5 shadow-lg' : 'hover:border-primary/30 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTaller(taller.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                          selectedTaller === taller.id ? 'bg-primary text-white' : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'
                        }`}>
                          <Building2 className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-lg">{taller.nombre}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card 
                  className={`cursor-pointer group transition-all duration-300 rounded-2xl border-2 ${
                    selectedTaller === "todos" ? 'border-primary bg-primary/5 shadow-lg' : 'hover:border-primary/30 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTaller("todos")}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                        selectedTaller === "todos" ? 'bg-primary text-white' : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        <Share2 className="h-6 w-6" />
                      </div>
                      <span className="font-bold text-lg">Vista Global</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div id="report-preview-content" className="p-10 bg-white dark:bg-slate-950 max-w-5xl mx-auto my-8 rounded-3xl shadow-sm border">
              {/* Marca de Agua/Logo del PDF */}
              <ReportHeader title={reportData.title} date={new Date().toLocaleDateString()} />

              {/* Summary Cards */}
              <ReportSummaryCards summary={reportData.summary} />

              {/* Charts Section */}
              <div className="grid grid-cols-1 gap-8 mb-10">
                <Card className="border-none bg-muted/20 rounded-3xl shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Análisis de Tendencias y Crecimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <MemoizedAreaChart data={reportData.chartData} />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-none bg-muted/20 rounded-3xl shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        Distribución de Impacto
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MemoizedPieChart data={reportData.pieData} />
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-muted/20 rounded-3xl shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        Resumen de Indicadores
                      </CardTitle>
                      <CardDescription>Principales métricas de desempeño</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reportData.pieData.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-sm font-bold">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Table Section */}
              <ReportDataTable data={reportData.tableData} />

              {/* Footer del PDF */}
              <div className="mt-12 pt-8 border-t text-center">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em]">
                  Documento generado por Plavet Academic Management Engine &copy; 2024
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

