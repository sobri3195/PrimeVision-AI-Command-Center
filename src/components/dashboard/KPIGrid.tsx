import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'

type KPI = { label: string; value: string | number; trend: string; micro: string; icon: LucideIcon; tone: 'critical' | 'high' | 'review' | 'stable' }
const toneMap = {
  critical: 'bg-rose-50 text-rose-700 border-rose-100',
  high: 'bg-amber-50 text-amber-700 border-amber-100',
  review: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  stable: 'bg-teal-50 text-teal-700 border-teal-100',
}

export function KPIGrid({ items }: { items: KPI[] }) {
  return <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{items.map((item) => <KPICard key={item.label} item={item} />)}</section>
}

function KPICard({ item }: { item: KPI }) {
  const UpDown = item.trend.startsWith('-') ? TrendingDown : TrendingUp
  return (
    <article className="card p-4">
      <div className="mb-3 flex items-center justify-between"><item.icon className="h-4 w-4 text-slate-600" /><span className={`rounded-full border px-2 py-0.5 text-[11px] ${toneMap[item.tone]}`}>{item.tone}</span></div>
      <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
      <p className="text-xs font-medium text-slate-600">{item.label}</p>
      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><UpDown className="h-3.5 w-3.5" />{item.trend} · {item.micro}</p>
    </article>
  )
}
