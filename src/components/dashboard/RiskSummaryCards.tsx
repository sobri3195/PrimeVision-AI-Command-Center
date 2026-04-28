import { StatCard } from '../shared/StatCard'

const hints: Record<string, string> = {
  Critical: 'Perlu review segera < 2 jam',
  High: 'Pantau aktif hari ini',
  'Doctor review': 'Menunggu verifikasi dokter',
  'Diabetes retina screening': 'Prioritas program skrining',
}

export function RiskSummaryCards({ stats }: { stats: Record<string, number> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Object.entries(stats).map(([k, v]) => (
        <StatCard key={k} label={k} value={v} hint={hints[k]} />
      ))}
    </div>
  )
}
