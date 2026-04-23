"use client"

import Main from "../../../main/pages/page"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useMisDocumentos } from "../hooks/useMisDocumentos"
import { 
  MisDocumentosHeader, 
  MisDocumentosFilters, 
  DocumentTable, 
  PdfPreviewDialog 
} from "../components"

export default function MisDocumentosPage() {
  const navigate = useNavigate()
  const {
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
  } = useMisDocumentos()

  return (
    <Main>
      <div className="space-y-6">
        <MisDocumentosHeader />

        <Card>
          <CardHeader>
            <CardTitle>Mis Documentos</CardTitle>
            <CardDescription>
              Visualiza y gestiona tus documentos cargados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MisDocumentosFilters
              filters={filters}
              isLoading={isLoading}
              onFiltersChange={onFiltersChange}
              onUploadClick={() => navigate("/subir")}
            />
            
            <DocumentTable
              documents={documents}
              isLoading={isLoading}
              getStatusBadge={getStatusBadge}
              onOpenPdf={openPdfPreview}
              onDeleteDocument={onDeleteDocument}
            />
          </CardContent>
        </Card>

        <PdfPreviewDialog
          preview={pdfPreview}
          onClose={closePdfPreview}
          onDownload={onDownloadDocument}
        />
      </div>
    </Main>
  )
}
