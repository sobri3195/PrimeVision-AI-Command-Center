import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowUpDown,
  Bell,
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  Circle,
  Download,
  LayoutGrid,
  MoreVertical,
  Plus,
  Search,
  Settings2,
  Sparkles,
  UserCircle2,
  Users,
} from 'lucide-react'
import type { Patient } from '../../types/patient'
import { loadLS, saveLS } from '../../utils/localStorage'

type RiskLevel = 'Stable' | 'Low' | 'Medium' | 'High' | 'Critical'

const branches = ['All', 'Prime Center Aksara', 'Prime Center Nana Rohana', 'Prime Executive', 'Prime Center A. Yani']
const reviewStatuses = ['Pending', 'In Review', 'Reviewed', 'Escalated']

const riskTone: Record<RiskLevel | 'Review', string> = {
  Critical: 'bg-red-50 text-red-700 border-red-100',
  High: 'bg-orange-50 text-orange-700 border-orange-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  Low: 'bg-sky-50 text-sky-700 border-sky-100',
  Stable: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Review: 'bg-violet-50 text-violet-700 border-violet-100',
}

const mapRisk = (score: number): RiskLevel => (score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 50 ? 'Medium' : score >= 30 ? 'Low' : 'Stable')

export function PatientsWorkspace({ patients, globalSearch, selectedPatient, onSelectPatient }: { patients: Patient[]; globalSearch: string; selectedPatient: Patient | null; onSelectPatient: (id: string | null) => void }) {
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState('All')
  const [risk, setRisk] = useState('All')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [visibleCols, setVisibleCols] = useState<string[]>(loadLS('pvcc:v2:patients:columns', ['patient', 'branch', 'score', 'risk', 'evidence', 'doctor', 'status', 'sla', 'visit', 'action']))

  const enriched = useMemo(
    () =>
      patients.map((p, i) => ({
        ...p,
        branch: p.branch === 'Aksara' ? 'Prime Center Aksara' : p.branch === 'Nana Rohana' ? 'Prime Center Nana Rohana' : p.branch === 'A. Yani' ? 'Prime Center A. Yani' : p.branch,
        riskLevel: mapRisk(p.aiRiskScore),
        review: reviewStatuses[i % reviewStatuses.length],
        doctor: ['Dr. Olivia Tan', 'Dr. Arief Putra', 'Dr. Shinta Wijaya', 'Dr. Michael Lim'][i % 4],
        sla: ['2h', '6h', '1d', 'Overdue'][i % 4],
        evidence: [['OCT anomaly', 'Doctor review required'], ['Missed follow-up', 'Retina screening due'], ['Post-op red flags'], ['Diabetes screening due', 'Follow-up gap']][i % 4],
      })),
    [patients],
  )

  const filtered = useMemo(() => enriched.filter((p) => {
    const q = `${globalSearch} ${query}`.toLowerCase()
    return (!q || `${p.name} ${p.medicalRecordNumber} ${p.city}`.toLowerCase().includes(q)) && (branch === 'All' || p.branch === branch) && (risk === 'All' || p.riskLevel === risk)
  }), [enriched, globalSearch, query, branch, risk])

  const riskCounts = useMemo(() => ({ All: enriched.length, Stable: 420, Low: 220, Medium: 135, High: 180, Critical: 45 }), [enriched.length])

  const toggleCol = (c: string) => {
    const next = visibleCols.includes(c) ? visibleCols.filter((x) => x !== c) : [...visibleCols, c]
    setVisibleCols(next)
    saveLS('pvcc:v2:patients:columns', next)
  }

  return <div className='space-y-4'>
    <PatientsPageHeader />
    <AICommandBar />
    <PatientFilters query={query} setQuery={setQuery} branch={branch} setBranch={setBranch} risk={risk} setRisk={setRisk} />
    <RiskTabs branch={branch} setBranch={setBranch} risk={risk} setRisk={setRisk} riskCounts={riskCounts} />
    <ColumnCustomizer visibleCols={visibleCols} toggleCol={toggleCol} />
    {selectedIds.length > 0 && <BulkActionBar count={selectedIds.length} clear={() => setSelectedIds([])} />}
    <PatientTable rows={filtered} visibleCols={visibleCols} selectedIds={selectedIds} setSelectedIds={setSelectedIds} onSelectPatient={onSelectPatient} />
    {selectedPatient && <PatientDrawer patient={selectedPatient} onClose={() => onSelectPatient(null)} />}
    <p className='rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs text-violet-700'>AI suggestions require doctor review. Not for autonomous clinical diagnosis.</p>
  </div>
}

const PatientsPageHeader = () => <section className='rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm'><h2 className='text-2xl font-semibold text-slate-900'>Patients</h2><p className='mt-1 text-sm text-slate-600'>Manage patient risk, follow-up status, AI triage, and clinical review workflow.</p><div className='mt-4 flex flex-wrap gap-2 text-xs'>{['1,000 Total Patients', '45 Critical', '355 Doctor Review', '89% Follow-up Compliance'].map((i) => <span key={i} className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700'>{i}</span>)}</div><div className='mt-4 flex gap-2'><button className='rounded-lg bg-slate-900 px-3 py-2 text-sm text-white'>Add Patient</button><button className='rounded-lg border border-slate-300 px-3 py-2 text-sm'>Export</button><button className='rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-700'>Create Review Batch</button></div></section>

const AICommandBar = () => <section className='rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white shadow-sm'><p className='text-xs font-semibold uppercase tracking-wide text-slate-300'>AI Patient Triage</p><div className='mt-2 flex gap-2'><input className='h-11 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm placeholder:text-slate-400' placeholder='Ask AI to find high-risk patients, missed follow-ups, retina screening gaps…' /><button className='rounded-xl bg-teal-500 px-4 text-sm font-medium'>Run AI Search</button></div><div className='mt-3 flex flex-wrap gap-2'>{['Critical retina cases', 'Missed follow-up', 'Post-op red flags', 'Diabetes screening due', 'Doctor review required'].map((q) => <button key={q} className='rounded-full border border-slate-600 px-3 py-1 text-xs'>{q}</button>)}</div><p className='mt-3 text-xs text-teal-200'>AI found 45 patients requiring urgent doctor review.</p></section>

const PatientFilters = ({ query, setQuery, branch, setBranch, risk, setRisk }: any) => <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'><div className='grid gap-3 lg:grid-cols-5'>{[[query,setQuery,'Search patient, MRN, city'],[branch,setBranch,'All'],[risk,setRisk,'All']].map((v,i)=><input key={i} value={v[0]} onChange={(e)=>v[1](e.target.value)} placeholder={v[2]} className='h-10 rounded-lg border border-slate-200 px-3 text-sm'/>) }<select className='h-10 rounded-lg border border-slate-200 px-3 text-sm'><option>Sort by Risk Score</option></select><select className='h-10 rounded-lg border border-slate-200 px-3 text-sm'><option>Descending</option></select><select className='h-10 rounded-lg border border-slate-200 px-3 text-sm'><option>Rows 24</option></select></div><div className='mt-3 flex gap-2 text-xs'><button className='rounded-lg border px-3 py-1.5'>Save preset</button><button className='rounded-lg border px-3 py-1.5'>Reset filters</button><button className='rounded-lg border px-3 py-1.5'>Export filtered CSV</button></div></section>

const RiskTabs = ({ risk, setRisk, riskCounts }: any) => <div className='flex flex-wrap gap-2'>{Object.entries(riskCounts).map(([k,v])=><button key={k} onClick={()=>setRisk(k)} className={`rounded-lg border px-3 py-1.5 text-sm ${risk===k?'bg-slate-900 text-white':'bg-white'}`}>{k} <span className='text-xs opacity-80'>{v as number}</span></button>)}</div>
const ColumnCustomizer = ({ visibleCols, toggleCol }: any) => <details className='rounded-xl border border-slate-200 bg-white p-3 text-sm'><summary className='cursor-pointer font-medium'>Customize Columns</summary><div className='mt-3 flex flex-wrap gap-4'>{['patient','branch','score','risk','evidence','doctor','status','sla','visit','action'].map((c)=><label key={c} className='flex items-center gap-2'><input type='checkbox' checked={visibleCols.includes(c)} onChange={()=>toggleCol(c)}/>{c}</label>)}</div></details>

const PatientRiskBadge = ({ level }: { level: RiskLevel }) => <span className={`rounded-full border px-2 py-1 text-xs ${riskTone[level]}`}>{level}</span>

const PatientTable = ({ rows, visibleCols, selectedIds, setSelectedIds, onSelectPatient }: any) => <section className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'><div className='max-h-[560px] overflow-auto'><table className='min-w-full text-sm'><thead className='sticky top-0 bg-slate-50 text-slate-600'><tr><th className='px-3 py-3'><input type='checkbox'/></th><th className='px-3 py-3 text-left'>Patient</th><th className='px-3 py-3 text-left'>Branch</th><th className='px-3 py-3 text-left'>Risk Score</th><th className='px-3 py-3 text-left'>Risk Level</th><th className='px-3 py-3 text-left'>Evidence Signals</th><th className='px-3 py-3 text-left'>Assigned Doctor</th><th className='px-3 py-3 text-left'>Review Status</th><th className='px-3 py-3 text-left'>SLA Remaining</th><th className='px-3 py-3 text-left'>Last Visit</th><th className='px-3 py-3 text-left'>Action</th></tr></thead><tbody>{rows.slice(0,24).map((p:any)=><tr key={p.id} className='border-t border-slate-100 hover:bg-slate-50'><td className='px-3 py-3'><input type='checkbox' checked={selectedIds.includes(p.id)} onChange={(e)=> setSelectedIds(e.target.checked?[...selectedIds,p.id]:selectedIds.filter((id:string)=>id!==p.id))}/></td><td className='px-3 py-3'><p className='font-medium text-slate-900'>{p.name}</p><p className='text-xs text-slate-500'>{p.medicalRecordNumber} · {p.city}</p></td><td className='px-3 py-3'>{p.branch}</td><td className='px-3 py-3'><div className='w-24 rounded-full bg-slate-100'><div className='h-1.5 rounded-full bg-teal-500' style={{width:`${p.aiRiskScore}%`}}/></div><span className='text-xs'>{p.aiRiskScore}</span></td><td className='px-3 py-3'><PatientRiskBadge level={p.riskLevel} /></td><td className='px-3 py-3'>{p.evidence.map((e:string)=><span key={e} className='mr-1 inline-block rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px]'>{e}</span>)}</td><td className='px-3 py-3'>{p.doctor}</td><td className='px-3 py-3'><span className='rounded-full border border-violet-100 bg-violet-50 px-2 py-1 text-xs text-violet-700'>{p.review}</span></td><td className='px-3 py-3'>{p.sla}</td><td className='px-3 py-3'>{p.lastVisitDate}</td><td className='px-3 py-3'><div className='flex gap-1'><button onClick={()=>onSelectPatient(p.id)} className='rounded border px-2 py-1 text-xs'>Open Case</button><button className='rounded border px-2 py-1 text-xs'>Assign</button><button className='rounded border px-2 py-1 text-xs'>Mark Reviewed</button></div></td></tr>)}</tbody></table></div></section>

const PatientDrawer = ({ patient, onClose }: any) => <aside className='fixed inset-y-0 right-0 z-40 w-[420px] border-l border-slate-200 bg-white p-5 shadow-2xl'><button onClick={onClose} className='mb-3 text-xs text-slate-500'>Close</button><h3 className='text-lg font-semibold'>{patient.name}</h3><p className='text-sm text-slate-500'>{patient.medicalRecordNumber} · {patient.city}</p><div className='mt-4 space-y-3 text-sm'><p><strong>AI risk score:</strong> {patient.aiRiskScore}</p><p><strong>Reasoning summary:</strong> Elevated retina and follow-up gap signals detected.</p><p><strong>Suggested next action:</strong> Doctor Review Required</p><p className='rounded-lg border border-violet-200 bg-violet-50 p-2 text-xs text-violet-700'>AI suggestions require doctor review. Not for autonomous clinical diagnosis.</p></div></aside>

const BulkActionBar = ({ count, clear }: any) => <div className='sticky bottom-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-lg'><p className='text-sm font-medium'>{count} selected</p><div className='flex gap-2 text-xs'><button className='rounded border px-2 py-1'>Assign doctor</button><button className='rounded border px-2 py-1'>Create review batch</button><button className='rounded border px-2 py-1'>Export selected</button><button className='rounded border px-2 py-1'>Mark as reviewed</button><button className='rounded border px-2 py-1'>Send follow-up reminder</button><button onClick={clear} className='rounded border border-red-200 px-2 py-1 text-red-600'>Clear</button></div></div>
