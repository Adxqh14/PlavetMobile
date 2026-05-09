import { apiClient, API_BASE_URL } from '@/lib/api'
import type { Document, DocumentFormData, DocumentFilters, DocumentStatus } from '../types'

// Backend returns estado in lowercase ("pendiente") — normalize to UI casing
const normalizeEstado = (raw: string): DocumentStatus => {
  const map: Record<string, DocumentStatus> = {
    pendiente: 'Pendiente',
    validado: 'Validado',
    aprobado: 'Validado',
    rechazado: 'Rechazado',
    'en revisión': 'En Revisión',
    'en revision': 'En Revisión',
  }
  return map[raw?.toLowerCase()] ?? (raw as DocumentStatus)
}

const toBackendEstado = (estado: DocumentStatus): string => {
  const map: Record<DocumentStatus, string> = {
    'Pendiente': 'pendiente',
    'Validado': 'aprobado',
    'Rechazado': 'rechazado',
    'En Revisión': 'en revision',
  }
  return map[estado] ?? estado.toLowerCase()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDocumento = (raw: any): Document => ({
  id: String(raw.id),
  id_estudiante: raw.id_estudiante ?? '',
  // Backend field is "tipo_documento"; GET endpoints may use "tipo"
  tipo: raw.tipo_documento ?? raw.tipo ?? '',
  // Backend field is "storage_key"; GET endpoints may use "storage_path"
  storage_path: raw.storage_key ?? raw.storage_path ?? '',
  bucket: raw.bucket ?? '',
  estado: normalizeEstado(raw.estado ?? 'pendiente'),
  // Backend field is "fecha_subida"; GET endpoints may use "fecha_creacion"
  fecha_creacion: raw.fecha_subida ?? raw.fecha_creacion ?? raw.createdAt ?? new Date().toISOString(),
  url_descarga: raw.url_descarga ?? undefined,
  uploadedBy: raw.estudiante_nombre ?? raw.uploadedBy ?? undefined,
})

export class DocumentacionService {
  static async getDocumentsByEstudiante(id_estudiante: string): Promise<Document[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient.get<any>(`/api/v1/documentos/estudiante/${id_estudiante}`)
    const raw: unknown[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
    return raw.map(mapDocumento)
  }

  static async getDocumentsByTaller(id_taller: string): Promise<Document[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient.get<any>(`/api/v1/documentos/taller/${id_taller}`)
    const raw: unknown[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
    return raw.map(mapDocumento)
  }

  static async getAllDocuments(): Promise<Document[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient.get<any>(`/api/v1/documentos`)
    const raw: unknown[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
    return raw.map(mapDocumento)
  }

  static async uploadDocument(formData: DocumentFormData): Promise<Document> {
    if (!formData.file) throw new Error('No se ha seleccionado un archivo')

    const fd = new FormData()
    fd.append('file', formData.file)
    fd.append('tipo_documento', formData.tipo)
    if (formData.id_estudiante) {
      fd.append('id_estudiante', formData.id_estudiante)
    }

    const token = localStorage.getItem('plavet_token')
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(`${API_BASE_URL}/api/v1/documentos/upload`, {
      method: 'POST',
      headers,
      body: fd,
      credentials: 'include',
    })

    if (!response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = await response.json().catch((): any => ({}))
      throw new Error(err.message ?? err.detail ?? `Error ${response.status}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await response.json().catch((): any => ({}))
    return mapDocumento(result?.data ?? result)
  }

  static async updateDocumentStatus(documentId: string, estado: DocumentStatus): Promise<Document> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient.patch<any>(`/api/v1/documentos/${documentId}/estado`, { estado: toBackendEstado(estado) })
    return mapDocumento(res?.data ?? res)
  }

  static async deleteDocument(documentId: string): Promise<void> {
    await apiClient.delete(`/api/v1/documentos/${documentId}`)
  }

  static downloadDocument(doc: Document): void {
    if (doc.url_descarga) {
      window.open(doc.url_descarga, '_blank', 'noopener,noreferrer')
    }
  }

  // Kept for backward compat — returns empty; callers should migrate to the typed methods above
  static async getDocuments(_filters: DocumentFilters): Promise<Document[]> {
    return []
  }

  static getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Validado':
        return { className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300', text: 'Validado' }
      case 'Pendiente':
        return { className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300', text: 'Pendiente' }
      case 'Rechazado':
        return { className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300', text: 'Rechazado' }
      case 'En Revisión':
        return { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', text: 'En Revisión' }
      default:
        return { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300', text: 'Desconocido' }
    }
  }
}
