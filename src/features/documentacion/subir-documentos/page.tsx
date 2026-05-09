"use client"

import { Upload, X, Check, File } from "lucide-react"

import Main from "@/features/main/pages/page"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"

import { useSubirDocumentos } from "./hooks/useSubirDocumentos"
import { UploadHero } from "./components/UploadHero"
import { UploadInfoCards } from "./components/UploadInfoCards"

const tiposDocumento = [
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

export default function SubirDocumentosPage() {
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
    handleRenameFile,
    handleUpload
  } = useSubirDocumentos()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const canUpload = uploadedFiles.length > 0 && selectedTipoDoc !== ""

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden pb-12">
        <UploadHero />

        <div className="mx-auto max-w-5xl px-6 md:px-0 space-y-8">
          <Card className="border-none bg-muted/30 shadow-none rounded-2xl overflow-hidden">
            <CardContent className="space-y-8 p-8">
              {/* Messages */}
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

              {/* Form Inputs */}
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
                      {tiposDocumento.map((tipo) => (
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
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files) }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all py-12 px-6 ${
                    isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-lg font-black text-foreground">Arrastra archivos aquí</p>
                  <p className="text-sm text-muted-foreground font-medium">o haz clic para seleccionar</p>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">PDF, DOC, IMG (MÁX. 10MB)</p>
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
                      <div key={file.id} className="flex items-center justify-between rounded-xl border bg-background p-4 group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                            <File className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Input
                              value={file.name}
                              onChange={(e) => handleRenameFile(file.id, e.target.value)}
                              className="h-8 p-0 text-sm font-black border-none bg-transparent focus-visible:ring-0 shadow-none"
                            />
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

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t gap-3">
                <Button variant="ghost" className="rounded-xl font-black uppercase text-xs tracking-widest" 
                  onClick={() => window.history.back()}>Regresar</Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!canUpload || isUploading}
                  className="rounded-xl font-black uppercase text-xs tracking-widest px-8 shadow-md shadow-primary/20"
                >
                  {isUploading ? "Subiendo..." : "Confirmar Subida"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <UploadInfoCards />
        </div>
      </div>
    </Main>
  )
}
