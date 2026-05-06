import type { Reporte } from '../hooks/useReportes'

export class ReporteService {
  static async getReportes(): Promise<Reporte[]> {
    const mockReportes: Reporte[] = [
      {
        id: 'estudiantes-pasantias',
        tipo: 'estudiantes-pasantias',
        titulo: 'Reporte de Estudiantes y Pasantías',
        descripcion: 'Análisis detallado de la participación estudiantil y progreso en pasantías por taller.',
        icono: 'Users',
        fecha: '2024-01-15',
        estado: 'activo'
      },
      {
        id: 'calificaciones',
        tipo: 'calificaciones',
        titulo: 'Reporte de Calificaciones',
        descripcion: 'Estadísticas de rendimiento académico y evaluaciones finales por área técnica.',
        icono: 'Star',
        fecha: '2024-01-10',
        estado: 'activo'
      },
      {
        id: 'asignaciones',
        tipo: 'asignaciones',
        titulo: 'Reporte de Asignaciones',
        descripcion: 'Control y seguimiento de la vinculación de estudiantes con centros de trabajo.',
        icono: 'Building2',
        fecha: '2024-01-08',
        estado: 'activo'
      },
      {
        id: 'documentacion',
        tipo: 'documentacion',
        titulo: 'Documentación Estudiantil',
        descripcion: 'Estado de entrega y validación de expedientes de estudiantes activos.',
        icono: 'FolderOpen',
        fecha: '2024-01-05',
        estado: 'activo'
      }
    ]

    await new Promise(resolve => setTimeout(resolve, 50))
    return mockReportes
  }

  static async generateReporte(reporteId: string): Promise<Blob> {
    console.log(`Iniciando generación de reporte: ${reporteId}`)
    await new Promise(resolve => setTimeout(resolve, 200))
    return new Blob(['PDF content'], { type: 'application/pdf' })
  }

  static async getReporteData(reporteType: string, tallerName: string = 'todos') {
    const isGeneral = tallerName === 'todos';
    // Ajuste a la realidad institucional: 26-36 estudiantes por taller
    const studentCount = isGeneral ? 245 : Math.floor(26 + Math.random() * 11);
    
    interface ReportDataModel {
      title: string;
      summary: Record<string, string | number>;
      chartData: Array<{ name: string; [key: string]: string | number }>;
      pieData: Array<{ name: string; value: number; color: string }>;
      tableData: Array<Record<string, string | number>>;
    }

    const dataModels: Record<string, ReportDataModel> = {
      'estudiantes-pasantias': {
        title: 'Análisis de Estudiantes y Pasantías',
        summary: {
          totalEstudiantes: studentCount,
          pasantiasActivas: Math.floor(studentCount * 0.8),
          tasaCompletado: "92.4%",
          empresasVinculadas: isGeneral ? 85 : 8
        },
        chartData: [
          { name: 'Ciclo 1', estudiantes: Math.floor(studentCount * 0.9) },
          { name: 'Ciclo 2', estudiantes: Math.floor(studentCount * 0.95) },
          { name: 'Ciclo 3', estudiantes: studentCount }
        ],
        pieData: [
          { name: 'En Curso', value: 70, color: '#E11D48' },
          { name: 'Completado', value: 25, color: '#F43F5E' },
          { name: 'Pendiente', value: 5, color: '#FB7185' }
        ],
        tableData: Array.from({ length: studentCount }).map((_, i) => ({
          id: i + 1,
          estudiante: `Estudiante ${i + 1}`,
          taller: tallerName,
          empresa: i % 3 === 0 ? 'TechCorp' : 'Industria Local',
          estado: 'Activo'
        }))
      },
      'calificaciones': {
        title: 'Reporte de Rendimiento Académico',
        summary: {
          estudiantesEvaluados: studentCount,
          promedioGeneral: (8.5 + Math.random()).toFixed(1),
          excelencia: "42%",
          sobresaliente: "38%"
        },
        chartData: [
          { name: 'Parcial 1', promedio: 8.2 },
          { name: 'Parcial 2', promedio: 8.8 },
          { name: 'Final', promedio: 9.1 }
        ],
        pieData: [
          { name: 'Excelente', value: 45, color: '#E11D48' },
          { name: 'Bueno', value: 40, color: '#F43F5E' },
          { name: 'Regular', value: 15, color: '#FB7185' }
        ],
        tableData: Array.from({ length: studentCount }).map((_, i) => ({
          id: i + 1,
          estudiante: `Estudiante ${i + 1}`,
          nota: (7.5 + Math.random() * 2.5).toFixed(1),
          asistencia: '98%',
          estado: 'Aprobado'
        }))
      },
      'asignaciones': {
        title: 'Control de Asignaciones y Empresas',
        summary: {
          totalPlazas: studentCount + 5,
          ocupadas: studentCount,
          disponibles: 5,
          tasaOcupacion: "95%"
        },
        chartData: [
          { name: 'Semana 1', asignados: Math.floor(studentCount * 0.5) },
          { name: 'Semana 2', asignados: Math.floor(studentCount * 0.8) },
          { name: 'Semana 3', asignados: studentCount }
        ],
        pieData: [
          { name: 'Tecnología', value: 50, color: '#E11D48' },
          { name: 'Industrial', value: 30, color: '#F43F5E' },
          { name: 'Servicios', value: 20, color: '#FB7185' }
        ],
        tableData: Array.from({ length: studentCount }).map((_, i) => ({
          id: i + 1,
          estudiante: `Estudiante ${i + 1}`,
          empresa: `Empresa ${String.fromCharCode(65 + (i % 5))}`,
          fecha: '2024-02-15',
          estado: 'Asignado'
        }))
      },
      'documentacion': {
        title: 'Estado de Documentación Estudiantil',
        summary: {
          expedientesTotales: studentCount,
          completos: Math.floor(studentCount * 0.85),
          pendientes: Math.floor(studentCount * 0.15),
          eficiencia: "88%"
        },
        chartData: [
          { name: 'Inicio', entregas: 10 },
          { name: 'Medio', entregas: Math.floor(studentCount * 0.6) },
          { name: 'Cierre', entregas: studentCount }
        ],
        pieData: [
          { name: 'Completo', value: 85, color: '#E11D48' },
          { name: 'Incompleto', value: 10, color: '#F43F5E' },
          { name: 'Pendiente', value: 5, color: '#FB7185' }
        ],
        tableData: Array.from({ length: studentCount }).map((_, i) => ({
          id: i + 1,
          estudiante: `Estudiante ${i + 1}`,
          expediente: i % 5 === 0 ? 'Incompleto' : 'Completo',
          documentos: '5/5',
          estado: 'Validado'
        }))
      }
    };

    await new Promise(resolve => setTimeout(resolve, 100))
    return dataModels[reporteType] || dataModels['calificaciones']
  }
}
