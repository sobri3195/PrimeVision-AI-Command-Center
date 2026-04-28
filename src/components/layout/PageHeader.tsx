export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-soft md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-600 hover:bg-slate-50">
          Export Laporan
        </button>
        <button className="rounded-xl bg-navy px-3 py-2 font-medium text-white hover:bg-navy/90">Buat Review</button>
      </div>
    </div>
  )
}
