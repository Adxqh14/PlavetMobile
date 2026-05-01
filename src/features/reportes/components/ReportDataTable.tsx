import { memo } from 'react'

interface ReportDataTableProps {
  data?: Array<Record<string, string | number>>
}

export const ReportDataTable = memo(({ data }: ReportDataTableProps) => {
  if (!data || data.length === 0) return null

  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-6 py-4 text-left font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-muted/5 transition-colors">
                {Object.values(row).map((value, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 font-medium text-foreground/80 whitespace-nowrap">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

ReportDataTable.displayName = 'ReportDataTable'
