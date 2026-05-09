import type { Document, DocumentFilters } from "../types"

interface Props {
  documents: Document[]
  filters: DocumentFilters
  onFiltersChange: (filters: Partial<DocumentFilters>) => void
  onDeleteDocument: (id: string) => void
  onDownloadDocument: (id: string) => void
  getStatusBadge: (status: string) => { className: string; text: string; icon?: string }
  isLoading: boolean
}

export function DocumentacionTableSimple({
  documents,
  onDeleteDocument,
  getStatusBadge,
  isLoading
}: Props) {
  console.log("DocumentacionTableSimple renderizando...", { documentsCount: documents.length, isLoading })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tabla Simple</h2>
      {isLoading ? (
        <p>Cargando documentos...</p>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => {
            const statusBadge = getStatusBadge(doc.estado)
            return (
              <div key={doc.id} className="border p-3 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{doc.tipo}</p>
                    <p className="text-sm text-gray-600">{doc.tipo} - {doc.uploadedBy}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusBadge.className}`}>
                      {statusBadge.text}
                    </span>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
