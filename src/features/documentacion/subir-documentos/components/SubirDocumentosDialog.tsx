"use client"

import { Upload, X, Check, File } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { useSubirDocumentos } from "../hooks/useSubirDocumentos"
import type { Document } from "../../documentos/types"
import { useEffect } from "react"

const tiposDocumentoAll = [
  "Cédula",
  "Curriculum Vitae",
  "Anexo IV",
  "Anexo V",
  "Acta de Nacimiento",
  "Cédula de Padres",
  "Tarjeta de Vacunación",
  "Certificado Médico",
  "Carta de Recomendación",
  "Seguro Médico",
  "Otro",
]

interface SubirDocumentosDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingDocuments: Document[]
  onUploadSuccess: () => void
}

export function SubirDocumentosDialog({ open, onOpenChange, existingDocuments, onUploadSuccess }: SubirDocumentosDialogProps) {
  const {
    isEstudiante,
    selectedTipoDoc,
    manualStudentId,
    uploadedFiles,
    isDragging,
    isUploading,
    uploadError,
    uploadSuccess,
    fileInputRef,
    setIsDragging,
    setSelectedTipoDoc,
    setManualStudentId,
    handleFileSelect,
    removeFile,
    handleUpload,
    clearFiles
  } = useSubirDocumentos()

  // Filter out already uploaded types
  const uploadedTypes = existingDocuments.map(doc => doc.tipo)
  const availableTipos = tiposDocumentoAll.filter(tipo => tipo === "Otro" || !uploadedTypes.includes(tipo))

  useEffect(() => {
    if (uploadSuccess) {
      onUploadSuccess()
      setTimeout(() => onOpenChange(false), 1500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadSuccess])

  // Reset state on close
  useEffect(() => {
    if (!open) {
      setSelectedTipoDoc("")
      setManualStudentId("")
      clearFiles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const canUpload = uploadedFiles.length > 0 && selectedTipoDoc !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 bg-linear-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Subir Documentos</DialogTitle>
              <DialogDescription>Sube tus documentos requeridos (PDF, JPG/JPEG).</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {uploadError && (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-bold border border-destructive/20 flex items-center gap-3">
              <X className="h-4 w-4" /> {uploadError}
            </div>
          )}
          {uploadSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-bold border border-emerald-500/20 flex items-center gap-3">
              <Check className="h-4 w-4" /> Documentos subidos exitosamente.
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {!isEstudiante && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">ID del Estudiante</Label>
                <Input
                  placeholder="UUID del estudiante"
                  value={manualStudentId}
                  onChange={(e) => setManualStudentId(e.target.value)}
                  className="h-12 rounded-xl bg-background border-2 font-medium"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tipo de Documento</Label>
              <Select value={selectedTipoDoc} onValueChange={setSelectedTipoDoc}>
                <SelectTrigger className="h-12 rounded-xl bg-background border-2 font-bold">
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {availableTipos.map((tipo) => (
                    <SelectItem key={tipo} value={tipo} className="font-bold">{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dropzone */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Archivos a Subir</Label>
            <div
              onDrop={(e) => { 
                e.preventDefault(); 
                if (!selectedTipoDoc) return;
                setIsDragging(false); 
                handleFileSelect(e.dataTransfer.files) 
              }}
              onDragOver={(e) => { 
                e.preventDefault(); 
                if (!selectedTipoDoc) return;
                setIsDragging(true) 
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => {
                if (selectedTipoDoc) fileInputRef.current?.click()
              }}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all py-12 px-6 ${
                !selectedTipoDoc 
                  ? "border-muted-foreground/10 bg-muted/5 cursor-not-allowed opacity-60"
                  : isDragging 
                    ? "border-primary bg-primary/5 scale-[0.99] cursor-pointer" 
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                accept=".pdf,.jpg,.jpeg"
                disabled={!selectedTipoDoc}
              />
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border mb-4 ${!selectedTipoDoc ? "bg-muted border-muted-foreground/20" : "bg-primary/10 border-primary/20"}`}>
                <Upload className={`h-6 w-6 ${!selectedTipoDoc ? "text-muted-foreground/50" : "text-primary"}`} />
              </div>
              {!selectedTipoDoc ? (
                <p className="text-sm font-black text-muted-foreground">Selecciona un tipo de documento primero</p>
              ) : (
                <>
                  <p className="text-sm font-black text-foreground">Arrastra archivos aquí</p>
                  <p className="text-xs text-muted-foreground font-medium">o haz clic para seleccionar</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">PDF, JPG/JPEG (MÁX. 10MB)</p>
                </>
              )}
            </div>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Archivos Seleccionados ({uploadedFiles.length})
              </Label>
              <div className="grid gap-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-xl border bg-background p-3 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                      <div className="h-8 w-8 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                        <File className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black truncate text-foreground leading-6">{file.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/20 flex justify-end gap-3">
          <Button variant="ghost" className="rounded-xl font-bold text-xs" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!canUpload || isUploading}
            className="rounded-xl font-bold text-xs px-6 shadow-md shadow-primary/20"
          >
            {isUploading ? "Subiendo..." : "Confirmar Subida"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
