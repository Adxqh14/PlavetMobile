import { useState, useRef } from "react"
import { DocumentacionService } from "../../documentos/services/documentacionService"
import { useAuth } from "@/features/auth/hooks/useAuth"

export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  file: File
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export function useSubirDocumentos() {
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

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // Only process the first file

    const validTypes = ["application/pdf", "image/jpeg", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      setUploadError(
        `Formato no válido para "${file.name}". Solo se aceptan archivos PDF y JPG/JPEG.`
      )
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(
        `El archivo "${file.name}" supera el límite de 10 MB. Por favor reduce el archivo.`
      )
      return
    }

    const newFile: UploadedFile = {
      id: `${Date.now()}`,
      name: selectedTipoDoc || file.name,
      type: file.type,
      size: file.size,
      file: file,
    }

    setUploadedFiles([newFile]) // Replace existing file, so there is only ONE
    setUploadSuccess(false)
    setUploadError(null)
  }

  const handleTipoDocChange = (value: string) => {
    setSelectedTipoDoc(value)
    if (uploadedFiles.length > 0) {
      setUploadedFiles((prev) => prev.map((f) => ({ ...f, name: value })))
    }
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const handleRenameFile = (id: string, newName: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    )
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

    try {
      for (const uploadedFile of uploadedFiles) {
        await DocumentacionService.uploadDocument({
          file: uploadedFile.file,
          tipo: selectedTipoDoc,
          description: "",
          id_estudiante: id_estudiante || "",
        })
      }
      setUploadSuccess(true)
      setSelectedTipoDoc("")
      setUploadedFiles([])
      if (!isEstudiante) setManualStudentId("")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      setUploadError(`Error subiendo documentos: ${msg}`)
    } finally {
      setIsUploading(false)
    }
  }

  return {
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
    setSelectedTipoDoc: handleTipoDocChange,
    setManualStudentId,
    handleFileSelect,
    removeFile,
    clearFiles: () => setUploadedFiles([]),
    handleRenameFile,
    handleUpload
  }
}
