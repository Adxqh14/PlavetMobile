export type DocumentStatus = "Pendiente" | "Validado" | "Rechazado" | "En Revisión"

export interface Document {
  id: string
  id_estudiante: string
  tipo: string
  storage_path: string
  bucket: string
  estado: DocumentStatus
  fecha_creacion: string
  url_descarga?: string
  // Extra properties to maintain UI design
  size?: string
  uploadedBy?: string
  description?: string
}

export interface DocumentFilters {
  searchTerm: string
  statusFilter: DocumentStatus | "all"
  typeFilter: string
  dateFilter: string
  id_taller?: string
}

export interface DocumentFormData {
  id_estudiante: string
  tipo: string
  description: string
  file: File | null
}
