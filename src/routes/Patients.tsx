import { useMemo, useState } from 'react'
import { FilterTabs } from '../components/shared/FilterTabs'
import { PageHeader } from '../components/layout/PageHeader'
import { RiskBadge } from '../components/ai/RiskBadge'
import { PatientDrawer } from '../components/shared/PatientDrawer'
import type { Patient } from '../types/patient'

export function Patients({ patients, globalSearch }: { patients: Patient[]; globalSearch: string }) {
  const [localSearch, setLocalSearch] = useState('')
  const [branch, setBranch] = useState('All')
  const [risk, setRisk] = useState('All')
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'branch'>('score')
  const [asc, setAsc] = useState(false)
  const [page, setPage] = useState(1)
  const [activePatient, setActivePatient] = useState<Patient | null>(null)
  const pageSize = 12

  const filtered = useMemo(() => {
    const query = `${globalSearch} ${localSearch}`.trim().toLowerCase()
    const result = patients.filter(
      (p) =>
        (!query || `${p.name} ${p.medicalRecordNumber} ${p.city} ${p.branch}`.toLowerCase().includes(query)) &&
        (branch === 'All' || p.branch === branch) &&
        (risk === 'All' || p.aiUrgencyLevel === risk),
    )

    const sorted = [...result].sort((a, b) => {
      const factor = asc ? 1 : -1
      if (sortBy === 'score') return (a.aiRiskScore - b.aiRiskScore) * factor
      if (sortBy === 'name') return a.name.localeCompare(b.name) * factor
      return a.branch.localeCompare(b.branch) * factor
    })

    return sorted
  }, [patients, globalSearch, localSearch, branch, risk, sortBy, asc])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <PageHeader title="Patients" subtitle="Interactive patient list with realtime search, branch filter, urgency filter, sorting, and pagination." />
      <div className="card p-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <input
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search nama, MRN, kota..."
            className="h-11 rounded-2xl border border-slate-200 px-4 text-sm"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="h-11 rounded-2xl border border-slate-200 px-3 text-sm">
            <option value="score">Sort by Risk Score</option>
            <option value="name">Sort by Name</option>
            <option value="branch">Sort by Branch</option>
          </select>
          <button onClick={() => setAsc((v) => !v)} className="h-11 rounded-2xl border border-slate-200 bg-white text-sm">
            Direction: {asc ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      <FilterTabs items={['All', ...Array.from(new Set(patients.map((p) => p.branch)))]} active={branch} onChange={(v) => { setBranch(v); setPage(1) }} />
      <FilterTabs items={['All', 'Low', 'Medium', 'High', 'Critical']} active={risk} onChange={(v) => { setRisk(v); setPage(1) }} />

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              {['MRN', 'Nama', 'Kota', 'Cabang', 'Skor', 'Urgency', 'Detail'].map((header) => (
                <th key={header} className="px-4 py-3 font-medium">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-400" colSpan={7}>No matching patient.</td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3">{p.medicalRecordNumber}</td>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.city}</td>
                <td className="px-4 py-3">{p.branch}</td>
                <td className="px-4 py-3"><RiskBadge score={p.aiRiskScore} /></td>
                <td className="px-4 py-3">{p.aiUrgencyLevel}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setActivePatient(p)} className="rounded-lg bg-navy px-3 py-1.5 text-xs text-white">Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span>
        <div className="space-x-2">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Prev</button>
          <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Next</button>
        </div>
      </div>

      <PatientDrawer patient={activePatient} onClose={() => setActivePatient(null)} />
    </div>
  )
}
