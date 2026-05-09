export function TutorAcademicFooter() {
  return (
    <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sincronización Académica Activa</span>
      </div>
      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Plavet v3.0 · Módulo Tutor Académico</p>
    </div>
  )
}
