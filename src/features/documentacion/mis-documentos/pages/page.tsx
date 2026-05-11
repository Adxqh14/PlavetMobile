"use client"

import Main from "../../../main/pages/page"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"

import { useMisDocumentos } from "../hooks/useMisDocumentos"
import { FileText } from "lucide-react"
import { 
  MisDocumentosHeader, 
  MisDocumentosFilters, 
  DocumentTable, 
  PdfPreviewDialog 
} from "../components"
import { SubirDocumentosDialog } from "../../subir-documentos/components/SubirDocumentosDialog"
import { useState } from "react"

export default function MisDocumentosPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
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
    closePdfPreview,
    reload
  } = useMisDocumentos()

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden pb-12">
        <MisDocumentosHeader />

        <div className="px-6 md:px-12 space-y-6">
          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Listado de Documentos</CardTitle>
                  <CardDescription className="text-xs font-medium">
                    Visualiza y gestiona tus documentos cargados en el sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <MisDocumentosFilters
                filters={filters}
                isLoading={isLoading}
                onFiltersChange={onFiltersChange}
                onUploadClick={() => setUploadDialogOpen(true)}
                onRefresh={reload}
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
        </div>

        <PdfPreviewDialog
          preview={pdfPreview}
          onClose={closePdfPreview}
          onDownload={onDownloadDocument}
        />
        <SubirDocumentosDialog 
          open={uploadDialogOpen} 
          onOpenChange={setUploadDialogOpen} 
          existingDocuments={documents}
          onUploadSuccess={() => onFiltersChange({})} // Refresh documents
        />
      </div>
    </Main>
  )
}
