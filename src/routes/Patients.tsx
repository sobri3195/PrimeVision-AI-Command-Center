import { useMemo, useState } from 'react'
import { RiskBadge } from '../components/ai/RiskBadge'
import { PageHeader } from '../components/layout/PageHeader'
import { FilterTabs } from '../components/shared/FilterTabs'
import { PatientDrawer } from '../components/shared/PatientDrawer'
import type { Patient } from '../types/patient'
import { loadLS, saveLS } from '../utils/localStorage'

type ColKey = 'mrn' | 'nama' | 'kota' | 'cabang' | 'skor' | 'urgency' | 'detail'
const allColumns: Array<{ key: ColKey; label: string }> = [
  { key: 'mrn', label: 'MRN' },
  { key: 'nama', label: 'Nama' },
  { key: 'kota', label: 'Kota' },
  { key: 'cabang', label: 'Cabang' },
  { key: 'skor', label: 'Skor' },
  { key: 'urgency', label: 'Urgency' },
  { key: 'detail', label: 'Detail' },
]

export function Patients({ patients, globalSearch }: { patients: Patient[]; globalSearch: string }) {
  const [localSearch, setLocalSearch] = useState('')
  const [branch, setBranch] = useState('All')
  const [risk, setRisk] = useState('All')
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'branch'>('score')
  const [asc, setAsc] = useState(false)
  const [page, setPage] = useState(1)
  const [activePatient, setActivePatient] = useState<Patient | null>(null)
  const [columns, setColumns] = useState<ColKey[]>(loadLS('pvcc:v1:table:patients:columns', allColumns.map((c) => c.key)))

  const pageSize = 12

  const filtered = useMemo(() => {
    const query = `${globalSearch} ${localSearch}`.trim().toLowerCase()
    const result = patients.filter(
      (p) =>
        (!query || `${p.name} ${p.medicalRecordNumber} ${p.city} ${p.branch}`.toLowerCase().includes(query)) &&
        (branch === 'All' || p.branch === branch) &&
        (risk === 'All' || p.aiUrgencyLevel === risk),
    )

    return [...result].sort((a, b) => {
      const factor = asc ? 1 : -1
      if (sortBy === 'score') return (a.aiRiskScore - b.aiRiskScore) * factor
      if (sortBy === 'name') return a.name.localeCompare(b.name) * factor
      return a.branch.localeCompare(b.branch) * factor
    })
  }, [patients, globalSearch, localSearch, branch, risk, sortBy, asc])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const applyPreset = () => {
    const preset = { branch, risk }
    saveLS('pvcc:v1:filters:patientsPreset', preset)
  }

  const loadPreset = () => {
    const preset = loadLS<{ branch: string; risk: string }>('pvcc:v1:filters:patientsPreset', { branch: 'All', risk: 'All' })
    setBranch(preset.branch)
    setRisk(preset.risk)
    setPage(1)
  }

  const toggleColumn = (key: ColKey) => {
    const next = columns.includes(key) ? columns.filter((c) => c !== key) : [...columns, key]
    setColumns(next)
    saveLS('pvcc:v1:table:patients:columns', next)
  }

  const openPatient = (p: Patient) => {
    const history = loadLS<Array<{ id: string; ts: number }>>('pvcc:v1:navigation:recentPatients', [])
    const next = [{ id: p.id, ts: Date.now() }, ...history.filter((h) => h.id !== p.id)].slice(0, 20)
    saveLS('pvcc:v1:navigation:recentPatients', next)
    setActivePatient(p)
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Patients" subtitle="Interactive patient list with realtime search, filters, sorting, presets, and customizable columns." />
      <div className="card p-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <input value={localSearch} onChange={(e) => { setLocalSearch(e.target.value); setPage(1) }} placeholder="Search nama, MRN, kota..." className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="h-11 rounded-2xl border border-slate-200 px-3 text-sm">
            <option value="score">Sort by Risk Score</option><option value="name">Sort by Name</option><option value="branch">Sort by Branch</option>
          </select>
          <button onClick={() => setAsc((v) => !v)} className="h-11 rounded-2xl border border-slate-200 bg-white text-sm">Direction: {asc ? 'Ascending' : 'Descending'}</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={applyPreset} className="rounded-lg border px-3 py-1 text-xs">Save current filter preset</button>
          <button onClick={loadPreset} className="rounded-lg border px-3 py-1 text-xs">Apply saved preset</button>
        </div>
      </div>

      <FilterTabs items={['All', ...Array.from(new Set(patients.map((p) => p.branch)))]} active={branch} onChange={(v) => { setBranch(v); setPage(1) }} />
      <FilterTabs items={['All', 'Low', 'Medium', 'High', 'Critical']} active={risk} onChange={(v) => { setRisk(v); setPage(1) }} />

      <details className="card p-3 text-xs" open>
        <summary className="cursor-pointer font-medium">Column visibility</summary>
        <div className="mt-2 flex flex-wrap gap-3">
          {allColumns.map((c) => <label key={c.key} className="flex items-center gap-1"><input type="checkbox" checked={columns.includes(c.key)} onChange={() => toggleColumn(c.key)} />{c.label}</label>)}
        </div>
      </details>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500"><tr>{allColumns.filter((c) => columns.includes(c.key)).map((header) => <th key={header.key} className="px-4 py-3 font-medium">{header.label}</th>)}</tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={columns.length}>No matching patient.</td></tr>}
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                {columns.includes('mrn') && <td className="px-4 py-3">{p.medicalRecordNumber}</td>}
                {columns.includes('nama') && <td className="px-4 py-3">{p.name}</td>}
                {columns.includes('kota') && <td className="px-4 py-3">{p.city}</td>}
                {columns.includes('cabang') && <td className="px-4 py-3">{p.branch}</td>}
                {columns.includes('skor') && <td className="px-4 py-3"><RiskBadge score={p.aiRiskScore} /></td>}
                {columns.includes('urgency') && <td className="px-4 py-3">{p.aiUrgencyLevel}</td>}
                {columns.includes('detail') && <td className="px-4 py-3"><button onClick={() => openPatient(p)} className="rounded-lg bg-navy px-3 py-1.5 text-xs text-white">Open</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm"><span>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span><div className="space-x-2"><button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Prev</button><button disabled={page === totalPages || totalPages === 0} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Next</button></div></div>

      <PatientDrawer patient={activePatient} onClose={() => setActivePatient(null)} />
    </div>
  )
}
