import { Bar, BarChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function BranchPerformanceChart({ data, period, setPeriod }: { data: { branch: string; score: number; avg: number; trend: number }[]; period: 'Today' | 'Weekly' | 'Monthly'; setPeriod: (v: 'Today' | 'Weekly' | 'Monthly') => void }) {
  return (
    <section className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Branch Performance</h3>
        <div className="flex gap-1">{(['Today', 'Weekly', 'Monthly'] as const).map((p) => <button key={p} onClick={() => setPeriod(p)} className={`rounded-md px-2 py-1 text-xs ${period === p ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{p}</button>)}</div>
      </div>
      {data.length === 0 ? <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-sm text-slate-500">No branch data available for selected period.</div> : <div className="h-64"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="branch" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="score" name="Branch Score" fill="#0f172a" radius={[8, 8, 0, 0]} /><Bar dataKey="avg" name="Network Average" fill="#94a3b8" radius={[8, 8, 0, 0]} /><Line type="monotone" dataKey="trend" stroke="#06b6d4" strokeWidth={2} dot={false} name="Weekly Trend" /></BarChart></ResponsiveContainer></div>}
      <p className="mt-2 text-xs text-slate-500">Top branch: Jakarta Selatan · Underperforming: Nana Rohana.</p>
    </section>
  )
}
