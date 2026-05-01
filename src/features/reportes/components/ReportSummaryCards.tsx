import { memo } from 'react'

interface ReportSummaryCardsProps {
  summary: Record<string, number | string>
}

export const ReportSummaryCards = memo(({ summary }: ReportSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {Object.entries(summary).map(([key, value]) => (
        <div key={key} className="bg-primary/5 p-5 rounded-2xl border border-primary/10 transition-all hover:bg-primary/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          <p className="text-2xl font-black text-primary">{value}</p>
        </div>
      ))}
    </div>
  )
})

ReportSummaryCards.displayName = 'ReportSummaryCards'
