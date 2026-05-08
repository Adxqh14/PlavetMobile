import { useState, useEffect } from "react"
import { useDocumentacion } from "../../hooks/useDocumentacion"
import type { Document } from "../../types"

export function useMisDocumentos() {
  const {
    documents,
    filters,
    isLoading,
    onFiltersChange,
    onDownloadDocument,
    onDeleteDocument,
    getStatusBadge
  } = useDocumentacion()

  const [pdfPreview, setPdfPreview] = useState<{ open: boolean; url: string; title: string; documentId: string } | null>(null)

  useEffect(() => {
    return () => {
      if (pdfPreview?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(pdfPreview.url)
      }
    }
  }, [pdfPreview?.url])

  const openPdfPreview = (doc: Document) => {
    if (pdfPreview?.url && pdfPreview.url.startsWith('blob:')) {
      URL.revokeObjectURL(pdfPreview.url)
    }

    // Use the real temporary URL provided by the backend when available
    const url = doc.url_descarga ?? ''
    setPdfPreview({ open: true, url, title: doc.tipo, documentId: doc.id })
  }

  const closePdfPreview = () => {
    if (pdfPreview?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(pdfPreview.url)
    }
    setPdfPreview(null)
  }

  return {
    documents,
    filters,
    isLoading,
    onFiltersChange,
    onDownloadDocument,
    onDeleteDocument,
    getStatusBadge,
    pdfPreview,
    openPdfPreview,
    closePdfPreview
  }
}
