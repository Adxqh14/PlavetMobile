import type { Document, DocumentFormData, DocumentFilters, DocumentStatus } from '../types'

// Mock data reflecting tenant_ipisa.documento
let MOCK_DOCUMENTS: Document[] = [
  {
    id: 1,
    id_estudiante: "1234573",
    tipo: "Cédula",
    storage_path: "documentos/1234573/cedula.pdf",
    bucket: "documentos",
    estado: "Pendiente",
    fecha_creacion: "2024-01-15T10:30:00",
    size: "0.9 MB",
    uploadedBy: "Juan Pérez",
    description: "Documento de identificación"
  },
  {
    id: 2,
    id_estudiante: "1234573",
    tipo: "Curriculum Vitae",
    storage_path: "documentos/1234573/cv.pdf",
    bucket: "documentos",
    estado: "Pendiente",
    fecha_creacion: "2024-01-15T11:00:00",
    size: "0.4 MB",
    uploadedBy: "Juan Pérez",
    description: "CV actualizado"
  },
  {
    id: 3,
    id_estudiante: "1234573",
    tipo: "Anexo IV",
    storage_path: "documentos/1234573/anexo4.pdf",
    bucket: "documentos",
    estado: "Validado",
    fecha_creacion: "2024-01-16T09:15:00",
    size: "1.1 MB",
    uploadedBy: "Juan Pérez",
    description: "Anexo IV firmado"
  },
  {
    id: 4,
    id_estudiante: "1234573",
    tipo: "Anexo V",
    storage_path: "documentos/1234573/anexo5.pdf",
    bucket: "documentos",
    estado: "Pendiente",
    fecha_creacion: "2024-01-16T14:45:00",
    size: "1.0 MB",
    uploadedBy: "Juan Pérez",
    description: "Anexo V"
  },
  {
    id: 5,
    id_estudiante: "4037743378",
    tipo: "Acta de nacimiento",
    storage_path: "documentos/4037743378/acta.pdf",
    bucket: "documentos",
    estado: "Rechazado",
    fecha_creacion: "2024-01-17T08:20:00",
    size: "1.6 MB",
    uploadedBy: "Carolin Paulino",
    description: "Acta de nacimiento"
  },
  {
    id: 6,
    id_estudiante: "4037743378",
    tipo: "Cédula de Padres",
    storage_path: "documentos/4037743378/cedula_padres.pdf",
    bucket: "documentos",
    estado: "Validado",
    fecha_creacion: "2024-01-17T10:00:00",
    size: "1.3 MB",
    uploadedBy: "Carolin Paulino",
    description: "Documento de padres"
  },
  {
    id: 7,
    id_estudiante: "1234873",
    tipo: "Tarjeta de Vacunación",
    storage_path: "documentos/1234873/vacunacion.pdf",
    bucket: "documentos",
    estado: "En Revisión",
    fecha_creacion: "2024-01-18T16:30:00",
    size: "0.7 MB",
    uploadedBy: "Rochael Rodriguez",
    description: "Tarjeta de vacunación"
  }
]

let nextId = 8

export class DocumentacionService {
  static async getDocuments(filters: DocumentFilters): Promise<Document[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))

    // NOTE: When this is replaced with a real API call, pass filters.id_taller
    // so the backend returns only documents for students in that taller.
    let filtered = MOCK_DOCUMENTS

    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(doc =>
        doc.tipo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doc.id_estudiante.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      )
    }

    // Filtrar por estado
    if (filters.statusFilter !== "all") {
      filtered = filtered.filter(doc => doc.estado === filters.statusFilter)
    }

    // Filtrar por tipo
    if (filters.typeFilter) {
      filtered = filtered.filter(doc => 
        doc.tipo.toLowerCase().includes(filters.typeFilter.toLowerCase())
      )
    }

    // Filtrar por fecha
    if (filters.dateFilter) {
      filtered = filtered.filter(doc => 
        doc.fecha_creacion.includes(filters.dateFilter)
      )
    }

    return filtered
  }

  static async updateDocumentStatus(documentId: number, estado: DocumentStatus): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 250))

    const idx = MOCK_DOCUMENTS.findIndex(d => d.id === documentId)
    if (idx === -1) {
      throw new Error("Documento no encontrado")
    }

    const updated: Document = { ...MOCK_DOCUMENTS[idx], estado }
    MOCK_DOCUMENTS = [...MOCK_DOCUMENTS.slice(0, idx), updated, ...MOCK_DOCUMENTS.slice(idx + 1)]
    return updated
  }

  static async uploadDocument(formData: DocumentFormData): Promise<Document> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const selectedFile = formData.file
    const storagePath = `documentos/${formData.id_estudiante}/${selectedFile?.name ?? "archivo"}`

    const newDocument: Document = {
      id: nextId++,
      id_estudiante: formData.id_estudiante,
      tipo: formData.tipo,
      storage_path: storagePath,
      bucket: "documentos",
      estado: "Pendiente",
      fecha_creacion: new Date().toISOString(),
      size: formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB` : "0 MB",
      uploadedBy: "Usuario Actual",
      description: formData.description
    }

    console.log("[v0] Subiendo documento:", newDocument)

    MOCK_DOCUMENTS = [newDocument, ...MOCK_DOCUMENTS]
    
    return newDocument
  }

  static async deleteDocument(documentId: number): Promise<void> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log("[v0] Eliminando documento:", documentId)
    MOCK_DOCUMENTS = MOCK_DOCUMENTS.filter(d => d.id !== documentId)
  }

  static async downloadDocument(documentId: number): Promise<void> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log("[v0] Descargando documento:", documentId)
  }

  static getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "Validado":
        return { className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300", text: "Validado" }
      case "Pendiente":
        return { className: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300", text: "Pendiente" }
      case "Rechazado":
        return { className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", text: "Rechazado" }
      case "En Revisión":
        return { className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", text: "En Revisión" }
      default:
        return { className: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300", text: "Desconocido" }
    }
  }
}
