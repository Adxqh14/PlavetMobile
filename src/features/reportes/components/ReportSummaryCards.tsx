import { memo } from 'react'

interface ReportSummaryCardsProps {
  summary: Record<string, number | string>
}

export const ReportSummaryCards = memo(({ summary }: ReportSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
      {Object.entries(summary).map(([key, value]) => (
        <div key={key} className="bg-primary/5 p-4 md:p-6 rounded-3xl border border-primary/10 transition-all hover:bg-primary/10 flex flex-col justify-between min-h-[90px] md:min-h-[120px]">
          <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          <p className="text-xl md:text-3xl font-black text-primary mt-2 md:mt-4 leading-none">{value}</p>
        </div>
      ))}
    </div>
  )
})

ReportSummaryCards.displayName = 'ReportSummaryCards'
