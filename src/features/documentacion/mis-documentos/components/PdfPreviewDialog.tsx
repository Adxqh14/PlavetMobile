import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"

interface PdfPreviewDialogProps {
  preview: { open: boolean; url: string; title: string; documentId: number } | null
  onClose: () => void
  onDownload: (id: number) => void
}

export function PdfPreviewDialog({ preview, onClose, onDownload }: PdfPreviewDialogProps) {
  return (
    <Dialog open={!!preview?.open} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{preview?.title ?? "Vista previa"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-end gap-2">
            {preview?.documentId && (
              <Button variant="outline" onClick={() => onDownload(preview.documentId)}>
                Descargar
              </Button>
            )}
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ height: "70vh" }}>
            {preview?.url ? (
              <iframe title="pdf-preview" src={preview.url} className="w-full h-full" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                Cargando PDF...
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
