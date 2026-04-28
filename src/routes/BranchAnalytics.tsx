import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '../components/layout/PageHeader'
import { mockPatients } from '../data/mockPatients'

export function BranchAnalytics() {
  const [branchFilter, setBranchFilter] = useState('All')
  const [range, setRange] = useState('Mingguan')
  const [sortAsc, setSortAsc] = useState(false)

  const rows = useMemo(() => {
    const branches = Array.from(new Set(mockPatients.map((p) => p.branch))).map((name) => {
      const base = mockPatients.filter((p) => p.branch === name)
      const multiplier = range === 'Hari ini' ? 0.7 : range === 'Bulanan' ? 1.2 : 1
      return {
        name,
        patients: base.length,
        avgScore: Math.round((base.reduce((acc, p) => acc + p.aiRiskScore, 0) / base.length) * multiplier),
        critical: base.filter((p) => p.aiUrgencyLevel === 'Critical').length,
      }
    })
    return branches
      .filter((b) => branchFilter === 'All' || b.name === branchFilter)
      .sort((a, b) => (sortAsc ? a.avgScore - b.avgScore : b.avgScore - a.avgScore))
  }, [branchFilter, range, sortAsc])

  return (
    <div className="space-y-4">
      <PageHeader title="Branch Analytics" subtitle="Ringkasan performa cabang, ranking, dan trend AI risk." />

      <div className="card p-4 grid gap-3 md:grid-cols-3">
        <select className="h-11 rounded-xl border border-slate-200 px-3" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option>All</option>{Array.from(new Set(mockPatients.map((p) => p.branch))).map((b) => <option key={b}>{b}</option>)}
        </select>
        <select className="h-11 rounded-xl border border-slate-200 px-3" value={range} onChange={(e) => setRange(e.target.value)}>
          <option>Hari ini</option><option>Mingguan</option><option>Bulanan</option>
        </select>
        <button className="h-11 rounded-xl border border-slate-200" onClick={() => setSortAsc((v) => !v)}>Sort: {sortAsc ? 'Low to High' : 'High to Low'}</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="card p-4"><p className="text-sm text-slate-500">Total Branch</p><p className="text-2xl font-semibold text-navy">{rows.length}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Total Patient</p><p className="text-2xl font-semibold text-navy">{rows.reduce((a, b) => a + b.patients, 0)}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Critical Cases</p><p className="text-2xl font-semibold text-rose-600">{rows.reduce((a, b) => a + b.critical, 0)}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Avg AI Score</p><p className="text-2xl font-semibold text-amber-600">{Math.round(rows.reduce((a, b) => a + b.avgScore, 0) / Math.max(rows.length, 1))}</p></div>
      </div>

      <div className="card p-4 h-80">
        <ResponsiveContainer>
          <BarChart data={rows}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="avgScore" fill="#0F2747" radius={[10, 10, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left">Branch</th><th className="px-4 py-3 text-left">Patients</th><th className="px-4 py-3 text-left">Avg Score</th><th className="px-4 py-3 text-left">Critical</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.name} className="border-t"><td className="px-4 py-3">{r.name}</td><td className="px-4 py-3">{r.patients}</td><td className="px-4 py-3">{r.avgScore}</td><td className="px-4 py-3">{r.critical}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
