import { StatCard } from '../shared/StatCard'
export function RiskSummaryCards({ stats }: { stats: Record<string, number> }) { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Object.entries(stats).map(([k, v]) => <StatCard key={k} label={k} value={v} />)}</div> }
