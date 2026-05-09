import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Upload, FileText, X } from "lucide-react"
import type { DocumentFormData } from "../types"

interface Props {
  selectedFile: File | null
  onFileChange: (file: File | null) => void
  onUploadDocument: (formData: DocumentFormData) => void
  isLoading: boolean
}

export function DocumentacionForm({ selectedFile, onFileChange, onUploadDocument, isLoading }: Props) {
  const [formData, setFormData] = useState<DocumentFormData>({
    id_estudiante: "",
    tipo: "",
    description: "",
    file: null
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!formData.id_estudiante.trim()) {
      alert("Por favor ingrese el ID del estudiante")
      return
    }

    if (!formData.tipo) {
      alert("Por favor seleccione el tipo de documento")
      return
    }

    if (!selectedFile) {
      alert("Por favor seleccione un archivo")
      return
    }

    onUploadDocument({ ...formData, file: selectedFile })
    setFormData({ id_estudiante: "", tipo: "", description: "", file: null })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onFileChange(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Subir Documento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">ID Estudiante</label>
              <Input
                value={formData.id_estudiante}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, id_estudiante: e.target.value }))}
                placeholder="Ej: 1234573"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Documento</label>
              <Select
                value={formData.tipo}
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, tipo: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acta">Acta</SelectItem>
                  <SelectItem value="carta">Carta</SelectItem>
                  <SelectItem value="informe">Informe</SelectItem>
                  <SelectItem value="certificado">Certificado</SelectItem>
                  <SelectItem value="plan">Plan</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={formData.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción breve del documento (opcional)"
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Archivo</label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                className="flex-1"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <span className="text-xs">({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileChange(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 animate-spin" />
                Subiendo...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Subir Documento
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
