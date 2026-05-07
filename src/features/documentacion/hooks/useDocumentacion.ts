import { useState, useMemo, useEffect } from "react"
import type { Document, DocumentFilters, DocumentFormData, DocumentStatus } from "../types"
import { DocumentacionService } from "../services/documentacionService"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function useDocumentacion() {
  const { user, userRole } = useAuth()
  const tallerFilter = userRole === "TUTOR ACADEMICO" && user?.taller
    ? String(user.taller.id)
    : undefined

  const [documents, setDocuments] = useState<Document[]>([])
  const [filters, setFilters] = useState<DocumentFilters>({
    searchTerm: "",
    statusFilter: "all",
    typeFilter: "",
    dateFilter: "",
    id_taller: tallerFilter,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar documentos iniciales
  useEffect(() => {
    const loadInitialDocuments = async () => {
      setIsLoading(true)
      try {
        const docs = await DocumentacionService.getDocuments(filters)
        setDocuments(docs)
      } catch (error) {
        console.error("[v0] Error cargando documentos:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInitialDocuments()
  }, [filters]) // Incluir filters pero solo se ejecutará al montar

  // Cargar documentos cuando los filtros cambian (excepto al montar)
  useEffect(() => {
    if (documents.length > 0) { // Evitar cargar al montar
      const loadFilteredDocuments = async () => {
        setIsLoading(true)
        try {
          const docs = await DocumentacionService.getDocuments(filters)
          setDocuments(docs)
        } catch (error) {
          console.error("[v0] Error cargando documentos:", error)
        } finally {
          setIsLoading(false)
        }
      }
      
      loadFilteredDocuments()
    }
  }, [filters, documents.length]) // Incluir todas las dependencias

  // Filtrar documentos
  const filteredDocuments = useMemo(() => {
    return documents
  }, [documents])

  // Manejar cambios en filtros
  const handleFiltersChange = (newFilters: Partial<DocumentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Manejar subida de documento
  const handleUploadDocument = async (formData: DocumentFormData) => {
    setIsLoading(true)
    try {
      const newDocument = await DocumentacionService.uploadDocument(formData)
      setDocuments(prev => [newDocument, ...prev])
      setSelectedFile(null)
      console.log("[v0] Documento subido exitosamente")
    } catch (error) {
      console.error("[v0] Error subiendo documento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar eliminación de documento
  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm("¿Está seguro que desea eliminar este documento?")) {
      setIsLoading(true)
      try {
        await DocumentacionService.deleteDocument(documentId)
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
        console.log("[v0] Documento eliminado exitosamente")
      } catch (error) {
        console.error("[v0] Error eliminando documento:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Manejar descarga de documento
  const handleDownloadDocument = async (documentId: number) => {
    try {
      await DocumentacionService.downloadDocument(documentId)
      console.log("[v0] Documento descargado exitosamente")
    } catch (error) {
      console.error("[v0] Error descargando documento:", error)
    }
  }

  const handleUpdateDocumentStatus = async (documentId: number, status: DocumentStatus) => {
    setIsLoading(true)
    try {
      const updated = await DocumentacionService.updateDocumentStatus(documentId, status)
      setDocuments(prev => prev.map(d => (d.id === documentId ? updated : d)))
      console.log("[v0] Estado de documento actualizado")
    } catch (error) {
      console.error("[v0] Error actualizando estado:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar cambio de archivo
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
  }

  // Obtener badge de estado
  const getStatusBadge = DocumentacionService.getStatusBadge

  return {
    documents: filteredDocuments,
    filters,
    isLoading,
    selectedFile,
    onFiltersChange: handleFiltersChange,
    onUploadDocument: handleUploadDocument,
    onDeleteDocument: handleDeleteDocument,
    onDownloadDocument: handleDownloadDocument,
    onUpdateDocumentStatus: handleUpdateDocumentStatus,
    onFileChange: handleFileChange,
    getStatusBadge
  }
}
