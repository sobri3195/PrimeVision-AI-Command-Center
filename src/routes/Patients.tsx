import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataTable } from '../components/shared/DataTable'
import { FilterTabs } from '../components/shared/FilterTabs'
import { PageHeader } from '../components/layout/PageHeader'
import { RiskBadge } from '../components/ai/RiskBadge'
import type { Patient } from '../types/patient'

export function Patients({ patients, globalSearch }: { patients: Patient[]; globalSearch: string }) {
  const [branch, setBranch] = useState('All')
  const [risk, setRisk] = useState('All')
  const [page, setPage] = useState(1)
  const pageSize = 25

  const filtered = useMemo(() => [...patients].filter(p =>
    (globalSearch ? `${p.name} ${p.medicalRecordNumber} ${p.city}`.toLowerCase().includes(globalSearch.toLowerCase()) : true) &&
    (branch === 'All' || p.branch === branch) &&
    (risk === 'All' || p.aiUrgencyLevel === risk)
  ).sort((a,b)=>b.aiRiskScore-a.aiRiskScore), [patients, globalSearch, branch, risk])
  const totalPages = Math.ceil(filtered.length / pageSize)
  const rows = filtered.slice((page-1)*pageSize, page*pageSize)

  return <div className="space-y-4"><PageHeader title="Patients" subtitle="10.000 dummy dataset — search, filter, sorting, pagination" /><FilterTabs items={['All', ...Array.from(new Set(patients.map(p => p.branch)))]} active={branch} onChange={(v)=>{setBranch(v);setPage(1)}} /><FilterTabs items={['All','Low','Medium','High','Critical']} active={risk} onChange={(v)=>{setRisk(v);setPage(1)}} /><DataTable headers={['MRN','Nama','Kota','Cabang','Skor','Urgency','Detail']}>
    {rows.map(p => <tr key={p.id} className="border-t border-slate-100"><td className="px-4 py-3">{p.medicalRecordNumber}</td><td className="px-4 py-3">{p.name}</td><td className="px-4 py-3">{p.city}</td><td className="px-4 py-3">{p.branch}</td><td className="px-4 py-3"><RiskBadge score={p.aiRiskScore} /></td><td className="px-4 py-3">{p.aiUrgencyLevel}</td><td className="px-4 py-3"><Link to={`/patients/${p.id}`} className="text-navy underline">Open</Link></td></tr>)}
  </DataTable><div className="flex items-center justify-between text-sm"><span>Page {page} / {totalPages || 1}</span><div className="space-x-2"><button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Prev</button><button disabled={page===totalPages || totalPages===0} onClick={()=>setPage(p=>p+1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Next</button></div></div></div>
}
