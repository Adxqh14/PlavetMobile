import { FileText, Upload } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"

export function UploadInfoCards() {
  const infos = [
    { label: "Formatos Aceptados", value: "PDF, JPG, JPEG", icon: FileText, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Tamaño Máximo", value: "10 MB por archivo", icon: Upload, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {infos.map((info, i) => (
        <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${info.bg}`}>
              <info.icon className={`h-5 w-5 ${info.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{info.label}</p>
              <p className="text-sm font-black text-foreground">{info.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
