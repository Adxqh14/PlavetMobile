import type { Reporte } from '../hooks/useReportes'

export class ReporteService {
  static async getReportes(): Promise<Reporte[]> {
    // Simulación de datos - reemplazar con llamada real a API
    const mockReportes: Reporte[] = [
      {
        id: '1',
        tipo: 'estudiantes-pasantias',
        titulo: 'Reporte de Estudiantes y Pasantías',
        descripcion: 'Análisis completo de estudiantes en pasantías activas y su progreso',
        icono: 'Users',
        fecha: '2024-01-15',
        estado: 'activo'
      },
      {
        id: '2',
        tipo: 'calificaciones',
        titulo: 'Reporte de Calificaciones',
        descripcion: 'Estadísticas de calificaciones por taller y evaluador',
        icono: 'Star',
        fecha: '2024-01-10',
        estado: 'activo'
      },
      {
        id: '3',
        tipo: 'asignaciones',
        titulo: 'Reporte de Asignaciones',
        descripcion: 'Control de asignaciones de estudiantes a empresas',
        icono: 'Building2',
        fecha: '2024-01-08',
        estado: 'activo'
      },
      {
        id: '4',
        tipo: 'documentacion',
        titulo: 'Reporte de Documentación Estudiantil',
        descripcion: 'Seguimiento de documentos entregados por estudiantes',
        icono: 'FolderOpen',
        fecha: '2024-01-05',
        estado: 'pendiente'
      }
    ]

    // Simular delay de red mínimo para mayor fluidez
    await new Promise(resolve => setTimeout(resolve, 50))
    
    return mockReportes
  }

  static async generateReporte(reporteId: string): Promise<Blob> {
    // Simulación de generación de reporte
    console.log(`Generando reporte ${reporteId}`)
    
    // Simular delay de procesamiento mínimo
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // En un caso real, esto devolvería el PDF generado
    return new Blob(['PDF content'], { type: 'application/pdf' })
  }

  static async getReporteData(reporteType: string) {
    // Datos mock según el tipo de reporte
    const mockData = {
      'estudiantes-pasantias': {
        title: 'Reporte de Estudiantes y Pasantías',
        summary: {
          totalEstudiantes: 45,
          pasantiasActivas: 32,
          pasantiasCompletadas: 28,
          empresasParticipantes: 15
        },
        chartData: [
          { name: 'Enero', estudiantes: 12, pasantias: 8 },
          { name: 'Febrero', estudiantes: 15, pasantias: 10 },
          { name: 'Marzo', estudiantes: 18, pasantias: 14 },
          { name: 'Abril', estudiantes: 22, pasantias: 18 },
          { name: 'Mayo', estudiantes: 25, pasantias: 20 },
          { name: 'Junio', estudiantes: 30, pasantias: 25 }
        ],
        pieData: [
          { name: 'Desarrollo Web', value: 35, color: '#3b82f6' },
          { name: 'Diseño UX', value: 25, color: '#10b981' },
          { name: 'Marketing Digital', value: 20, color: '#f59e0b' },
          { name: 'Data Science', value: 20, color: '#8b5cf6' }
        ],
        tableData: [
          { id: 1, nombre: 'Juan Pérez', taller: 'Desarrollo Web', empresa: 'TechCorp', estado: 'Activo', horas: 240 },
          { id: 2, nombre: 'María García', taller: 'Diseño UX', empresa: 'DesignHub', estado: 'Activo', horas: 180 },
          { id: 3, nombre: 'Carlos Rodríguez', taller: 'Marketing Digital', empresa: 'AdAgency', estado: 'Completado', horas: 200 },
          { id: 4, nombre: 'Ana Martínez', taller: 'Data Science', empresa: 'DataLab', estado: 'Activo', horas: 220 }
        ]
      },
      'calificaciones': {
        title: 'Reporte de Calificaciones',
        summary: {
          totalCalificaciones: 156,
          promedioGeneral: 8.5,
          calificacionesAltas: 89,
          calificacionesBajas: 12
        },
        chartData: [
          { name: 'Desarrollo Web', promedio: 8.7, total: 45 },
          { name: 'Diseño UX', promedio: 8.2, total: 38 },
          { name: 'Marketing Digital', promedio: 8.9, total: 42 },
          { name: 'Data Science', promedio: 8.1, total: 31 }
        ],
        pieData: [
          { name: 'Excelente (9-10)', value: 45, color: '#10b981' },
          { name: 'Bueno (7-8)', value: 78, color: '#3b82f6' },
          { name: 'Regular (5-6)', value: 25, color: '#f59e0b' },
          { name: 'Insuficiente (<5)', value: 8, color: '#ef4444' }
        ],
        tableData: [
          { id: 1, estudiante: 'Juan Pérez', taller: 'Desarrollo Web', nota: 9.2, evaluador: 'Prof. Smith' },
          { id: 2, estudiante: 'María García', taller: 'Diseño UX', nota: 8.5, evaluador: 'Prof. Johnson' },
          { id: 3, estudiante: 'Carlos Rodríguez', taller: 'Marketing Digital', nota: 7.8, evaluador: 'Prof. Davis' },
          { id: 4, estudiante: 'Ana Martínez', taller: 'Data Science', nota: 9.0, evaluador: 'Prof. Wilson' }
        ]
      },
      'asignaciones': {
        title: 'Reporte de Asignaciones',
        summary: {
          totalAsignaciones: 67,
          empresasActivas: 23,
          plazasDisponibles: 15,
          asignacionesPendientes: 8
        },
        chartData: [
          { name: 'TechCorp', asignados: 12, capacidad: 15 },
          { name: 'DesignHub', asignados: 8, capacidad: 10 },
          { name: 'AdAgency', asignados: 6, capacidad: 8 },
          { name: 'DataLab', asignados: 10, capacidad: 12 },
          { name: 'StartupXYZ', asignados: 4, capacidad: 6 }
        ],
        pieData: [
          { name: 'Tecnología', value: 35, color: '#3b82f6' },
          { name: 'Diseño', value: 20, color: '#8b5cf6' },
          { name: 'Marketing', value: 25, color: '#f59e0b' },
          { name: 'Consultoría', value: 20, color: '#10b981' }
        ],
        tableData: [
          { id: 1, estudiante: 'Juan Pérez', empresa: 'TechCorp', puesto: 'Frontend Developer', fecha: '2024-01-15' },
          { id: 2, estudiante: 'María García', empresa: 'DesignHub', puesto: 'UX Designer', fecha: '2024-01-20' },
          { id: 3, estudiante: 'Carlos Rodríguez', empresa: 'AdAgency', puesto: 'Marketing Analyst', fecha: '2024-02-01' },
          { id: 4, estudiante: 'Ana Martínez', empresa: 'DataLab', puesto: 'Data Analyst', fecha: '2024-02-10' }
        ]
      },
      'documentacion': {
        title: 'Reporte de Documentación Estudiantil',
        summary: {
          totalDocumentos: 234,
          documentosCompletos: 189,
          documentosPendientes: 45,
          estudiantesConDocumentos: 67
        },
        chartData: [
          { name: 'Enero', documentos: 35, completados: 28 },
          { name: 'Febrero', documentos: 42, completados: 35 },
          { name: 'Marzo', documentos: 38, completados: 32 },
          { name: 'Abril', documentos: 45, completados: 38 },
          { name: 'Mayo', documentos: 40, completados: 34 },
          { name: 'Junio', documentos: 34, completados: 22 }
        ],
        pieData: [
          { name: 'CV', value: 67, color: '#3b82f6' },
          { name: 'Carta Recomendación', value: 45, color: '#10b981' },
          { name: 'Certificados', value: 56, color: '#f59e0b' },
          { name: 'Formularios', value: 66, color: '#8b5cf6' }
        ],
        tableData: [
          { id: 1, estudiante: 'Juan Pérez', tipo: 'CV', estado: 'Completado', fecha: '2024-01-15' },
          { id: 2, estudiante: 'María García', tipo: 'Carta Recomendación', estado: 'Pendiente', fecha: '2024-01-20' },
          { id: 3, estudiante: 'Carlos Rodríguez', tipo: 'Certificados', estado: 'Completado', fecha: '2024-02-01' },
          { id: 4, estudiante: 'Ana Martínez', tipo: 'Formularios', estado: 'Completado', fecha: '2024-02-10' }
        ]
      }
    }

    // Simular delay mínimo
    await new Promise(resolve => setTimeout(resolve, 50))
    
    return mockData[reporteType as keyof typeof mockData] || null
  }
}
