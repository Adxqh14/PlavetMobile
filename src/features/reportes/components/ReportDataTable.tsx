import { memo } from 'react'

interface ReportDataTableProps {
  data?: Array<Record<string, string | number>>
}

export const ReportDataTable = memo(({ data }: ReportDataTableProps) => {
  if (!data || data.length === 0) return null

  const columns = Object.keys(data[0])

  return (
    <div className="w-full">
      {/* Vista de Escritorio: Tabla */}
      <div className="hidden md:block border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                {columns.map((key) => (
                  <th key={key} className="px-6 py-4 text-left font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-muted/5 transition-colors">
                  {columns.map((key) => (
                    <td key={key} className="px-6 py-4 font-medium text-foreground/80 whitespace-nowrap">
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Móvil: Cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Registro #{index + 1}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">Activo</span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {columns.filter(k => k !== 'id').map((key) => (
                <div key={key} className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-xs font-semibold text-foreground truncate">{row[key]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

ReportDataTable.displayName = 'ReportDataTable'
