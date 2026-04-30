import { FileText } from "lucide-react"

export function MisDocumentosHeader() {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Mis Documentos</h1>
        <p className="text-sm text-muted-foreground">Administra y revisa tus documentos personales</p>
      </div>
    </div>
  )
}
