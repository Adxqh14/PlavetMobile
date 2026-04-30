
interface ReportHeaderProps {
  title: string
  date: string
}

export const ReportHeader = ({ title, date }: ReportHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-12 border-b pb-8">
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tighter mb-1">PLAVET</h1>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Intelligence Report System</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  )
}
