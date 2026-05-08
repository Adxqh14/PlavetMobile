import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"

interface PdfPreviewDialogProps {
  preview: { open: boolean; url: string; title: string; documentId: string } | null
  onClose: () => void
  onDownload: (id: string) => void
}

export function PdfPreviewDialog({ preview, onClose, onDownload }: PdfPreviewDialogProps) {
  return (
    <Dialog open={!!preview?.open} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent style={{ maxWidth: "96vw", width: "96vw", height: "96vh", display: "flex", flexDirection: "column", padding: "16px" }}>
        <DialogHeader style={{ flexShrink: 0 }}>
          <DialogTitle>{preview?.title ?? "Vista previa"}</DialogTitle>
        </DialogHeader>

        <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          {preview?.documentId && (
            <Button variant="outline" onClick={() => onDownload(preview.documentId)}>
              Descargar
            </Button>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 0, borderRadius: "8px", border: "1px solid var(--border)", overflow: "auto", display: "flex", justifyContent: "center", backgroundColor: "var(--muted)" }}>
          {preview?.url ? (
            <iframe title="pdf-preview" src={preview.url} style={{ width: "100%", maxWidth: "960px", height: "100%", border: "none", flexShrink: 0 }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
              Cargando PDF...
            </div>
          )}
        </div>
        <DialogFooter style={{ flexShrink: 0, marginTop: "8px" }}>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
