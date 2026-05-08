"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, X, Check, File, AlertCircle } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import Main from "@/features/main/pages/page"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { DocumentacionService } from "../services/documentacionService"


interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  file: File
}


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
  const { userRole } = useAuth()

  const isEstudiante = userRole === "ESTUDIANTE"

  const [selectedTipoDoc, setSelectedTipoDoc] = useState<string>("")
  const [manualStudentId, setManualStudentId] = useState<string>("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const oversized = Array.from(files).filter(f => f.size > MAX_FILE_SIZE)
    if (oversized.length > 0) {
      setUploadError(
        `El archivo "${oversized[0].name}" supera el límite de 10 MB (${(oversized[0].size / (1024 * 1024)).toFixed(1)} MB). Por favor comprime o reduce el archivo.`
      )
      return
    }

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: selectedTipoDoc ? selectedTipoDoc : file.name,
      type: file.type,
      size: file.size,
      file: file,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
    setUploadSuccess(false)
    setUploadError(null)
  }

  const handleTipoDocChange = (value: string) => {
    setSelectedTipoDoc(value)
    if (uploadedFiles.length > 0) {
      setUploadedFiles((prev) =>
        prev.map((f) => ({ ...f, name: value }))
      )
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const handleRenameFile = (id: string, newName: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || !selectedTipoDoc) {
      setUploadError("Por favor selecciona el tipo de documento y al menos un archivo")
      return
    }

    const id_estudiante = isEstudiante ? "" : manualStudentId

    if (!isEstudiante && !id_estudiante.trim()) {
      setUploadError("Ingresa el ID del estudiante")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    let successCount = 0
    for (const uploadedFile of uploadedFiles) {
      try {
        await DocumentacionService.uploadDocument({
          file: uploadedFile.file,
          tipo: selectedTipoDoc,
          description: "",
          id_estudiante: id_estudiante || "",
        })
        successCount++
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido"
        setUploadError(`Error subiendo "${uploadedFile.name}": ${msg}`)
        setIsUploading(false)
        return
      }
    }

    setIsUploading(false)
    setUploadSuccess(true)
    setSelectedTipoDoc("")
    setUploadedFiles([])
    if (!isEstudiante) setManualStudentId("")
    console.log(`[docs] ${successCount} documento(s) subido(s) exitosamente`)
  }

  const canUpload = uploadedFiles.length > 0 && selectedTipoDoc !== ""

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <Upload className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Subir <span className="text-primary">Documentos</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Gestiona y sube los documentos requeridos para tu proceso académico de forma rápida y segura.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-6 pb-12">

        {/* Form Section */}
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Selection Fields */}
            <div className="space-y-4">
              {/* Student ID — only shown for VINCULADOR */}
              {!isEstudiante && (
                <div className="space-y-2">
                  <Label htmlFor="id-estudiante" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    ID del Estudiante
                  </Label>
                  <Input
                    id="id-estudiante"
                    placeholder="UUID del estudiante"
                    value={manualStudentId}
                    onChange={(e) => setManualStudentId(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="tipo-doc" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Tipo de Documento
                </Label>
                <Select value={selectedTipoDoc} onValueChange={handleTipoDocChange}>
                  <SelectTrigger id="tipo-doc">
                    <SelectValue placeholder="Selecciona el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocumento.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-4">
              <Label>Archivos a Subir</Label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 text-lg font-medium">Arrastra archivos aquí</p>
                  <p className="mt-1 text-sm text-muted-foreground">o haz clic para seleccionar archivos</p>
                  <p className="mt-2 text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG (máx. 10MB)</p>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Archivos Seleccionados ({uploadedFiles.length})</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                      >
                        <div className="flex w-full items-center gap-3 overflow-hidden pr-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <File className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Input
                              value={file.name}
                              onChange={(e) => handleRenameFile(file.id, e.target.value)}
                              className="h-7 px-2 py-1 text-sm font-medium w-full border-transparent bg-transparent focus-visible:ring-1 hover:border-input"
                              placeholder="Nombre del archivo"
                            />
                            <p className="text-xs text-muted-foreground px-2">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="h-8 w-8 shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTipoDoc("")
                  setUploadedFiles([])
                  setUploadError(null)
                  setUploadSuccess(false)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpload} disabled={!canUpload || isUploading}>
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Subir Documentos
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Formatos Aceptados</p>
                <p className="font-semibold">PDF, DOC, IMG</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Upload className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tamaño Máximo</p>
                <p className="font-semibold">10 MB por archivo</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Check className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verificación</p>
                <p className="font-semibold">Automática</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </Main>
  )
}
