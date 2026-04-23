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

  const [pdfPreview, setPdfPreview] = useState<{ open: boolean; url: string; title: string; documentId: number } | null>(null)

  useEffect(() => {
    return () => {
      if (pdfPreview?.url) {
        URL.revokeObjectURL(pdfPreview.url)
      }
    }
  }, [pdfPreview?.url])

  const openPdfPreview = (doc: Document) => {
    if (pdfPreview?.url) {
      URL.revokeObjectURL(pdfPreview.url)
    }

    // Mock PDF content for preview
    const escapePdfText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
    const title = `Documento: ${doc.tipo}`
    const text = escapePdfText(title)

    const pdf = `%PDF-1.4\n` +
      `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
      `4 0 obj\n<< /Length 68 >>\nstream\nBT\n/F1 18 Tf\n72 720 Td\n(${text}) Tj\nET\nendstream\nendobj\n` +
      `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
      `xref\n0 6\n0000000000 65535 f \n` +
      `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n0\n%%EOF`

    const blob = new Blob([pdf], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    setPdfPreview({ open: true, url, title: doc.tipo, documentId: doc.id })
  }

  const closePdfPreview = () => {
    if (pdfPreview?.url) {
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
