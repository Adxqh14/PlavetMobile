import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Download, Loader2 } from "lucide-react"

interface DocumentPreviewDialogProps {
  preview: { open: boolean; url: string; title: string; documentId: string } | null
  onClose: () => void
  onDownload: (id: string) => void
}

export function DocumentPreviewDialog({ preview, onClose, onDownload }: DocumentPreviewDialogProps) {
  return (
    <Dialog open={!!preview?.open} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent style={{ maxWidth: "96vw", width: "96vw", height: "96vh", display: "flex", flexDirection: "column", padding: "16px" }}>
        <DialogHeader style={{ flexShrink: 0 }}>
          <DialogTitle className="text-xl font-black">{preview?.title ?? "Vista previa"}</DialogTitle>
        </DialogHeader>
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          {preview?.documentId && (
            <Button variant="outline" onClick={() => onDownload(preview.documentId)} className="rounded-xl font-bold">
              <Download className="h-4 w-4 mr-2" /> Descargar
            </Button>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0, borderRadius: "8px", border: "1px solid var(--border)", overflow: "auto", display: "flex", justifyContent: "center", backgroundColor: "var(--muted)" }}>
          {preview?.url ? (
            <iframe title="doc-preview" src={preview.url} style={{ width: "100%", maxWidth: "960px", height: "100%", border: "none", flexShrink: 0 }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando...
            </div>
          )}
        </div>
        <DialogFooter style={{ flexShrink: 0, marginTop: "8px" }}>
          <Button onClick={onClose} className="rounded-xl font-bold px-8">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
