import { useState, useMemo, useEffect, useCallback } from "react"
import type { Document, DocumentFilters, DocumentFormData, DocumentStatus } from "../types"
import { DocumentacionService } from "../services/documentacionService"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function useDocumentacion() {
  const { user, userRole } = useAuth()

  // ESTUDIANTE → fetch their own documents
  const studentId: string | undefined =
    userRole === "ESTUDIANTE"
      ? (user?.datos_rol?.id ?? user?.id ?? undefined)
      : undefined

  const [allDocuments, setAllDocuments] = useState<Document[]>([])
  const [filters, setFilters] = useState<DocumentFilters>({
    searchTerm: "",
    statusFilter: "all",
    typeFilter: "",
    dateFilter: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const loadDocuments = useCallback(async () => {
    setIsLoading(true)
    try {
      let docs: Document[]
      if (userRole === "ESTUDIANTE" && studentId) {
        docs = await DocumentacionService.getDocumentsByEstudiante(studentId)
      } else if (userRole !== "ESTUDIANTE") {
        docs = await DocumentacionService.getAllDocuments()
      } else {
        docs = []
      }
      setAllDocuments(docs)
    } catch (error) {
      console.error("[docs] Error cargando documentos:", error)
    } finally {
      setIsLoading(false)
    }
  }, [studentId, userRole])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // Client-side filtering
  const filteredDocuments = useMemo(() => {
    let result = allDocuments
    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase()
      result = result.filter(
        d =>
          d.tipo.toLowerCase().includes(q) ||
          d.id_estudiante.toLowerCase().includes(q) ||
          (d.uploadedBy?.toLowerCase().includes(q) ?? false),
      )
    }
    if (filters.statusFilter !== "all") {
      result = result.filter(d => d.estado === filters.statusFilter)
    }
    if (filters.typeFilter) {
      result = result.filter(d =>
        d.tipo.toLowerCase().includes(filters.typeFilter.toLowerCase()),
      )
    }
    if (filters.dateFilter) {
      result = result.filter(d => d.fecha_creacion.includes(filters.dateFilter))
    }
    return result
  }, [allDocuments, filters])

  const handleFiltersChange = (newFilters: Partial<DocumentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleUploadDocument = async (formData: DocumentFormData) => {
    setIsLoading(true)
    try {
      const newDoc = await DocumentacionService.uploadDocument(formData)
      setAllDocuments(prev => [newDoc, ...prev])
    } catch (error) {
      console.error("[docs] Error subiendo documento:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm("¿Está seguro que desea eliminar este documento?")) return
    setIsLoading(true)
    try {
      await DocumentacionService.deleteDocument(documentId)
      setAllDocuments(prev => prev.filter(d => d.id !== documentId))
    } catch (error) {
      console.error("[docs] Error eliminando documento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadDocument = (documentId: string) => {
    const doc = allDocuments.find(d => d.id === documentId)
    if (doc) DocumentacionService.downloadDocument(doc)
  }

  // No status-update endpoint yet — optimistic local update only
  const handleUpdateDocumentStatus = (documentId: string, status: DocumentStatus) => {
    setAllDocuments(prev =>
      prev.map(d => (d.id === documentId ? { ...d, estado: status } : d)),
    )
  }

  const getStatusBadge = DocumentacionService.getStatusBadge

  return {
    documents: filteredDocuments,
    filters,
    isLoading,
    selectedFile: null as File | null,
    onFiltersChange: handleFiltersChange,
    onUploadDocument: handleUploadDocument,
    onDeleteDocument: handleDeleteDocument,    // (id: string) => Promise<void>
    onDownloadDocument: handleDownloadDocument, // (id: string) => void
    onUpdateDocumentStatus: handleUpdateDocumentStatus, // (id: string, status) => void
    onFileChange: (_file: File | null) => {},
    getStatusBadge,
    reload: loadDocuments,
  }
}
