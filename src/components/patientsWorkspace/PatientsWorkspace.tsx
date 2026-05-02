import { useMemo, useState } from 'react'
import type { Patient } from '../../types/patient'
import { loadLS, saveLS } from '../../utils/localStorage'

type RiskLevel = 'Stable' | 'Low' | 'Medium' | 'High' | 'Critical'

type SoapNote = {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

type EditablePatient = Patient & {
  soap: SoapNote
}

const reviewStatuses = ['Pending', 'In Review', 'Reviewed', 'Escalated']
const doctors = ['Dr. Olivia Tan', 'Dr. Arief Putra', 'Dr. Shinta Wijaya', 'Dr. Michael Lim']
const evidenceByIndex = [
  ['OCT anomaly', 'Doctor review required'],
  ['Missed follow-up', 'Retina screening due'],
  ['Post-op red flags'],
  ['Diabetes screening due', 'Follow-up gap'],
]

const mapRisk = (score: number): RiskLevel => (score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 50 ? 'Medium' : score >= 30 ? 'Low' : 'Stable')

const riskTone: Record<RiskLevel, string> = {
  Critical: 'bg-red-50 text-red-700 border-red-100',
  High: 'bg-orange-50 text-orange-700 border-orange-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  Low: 'bg-sky-50 text-sky-700 border-sky-100',
  Stable: 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

const blankSoap = (): SoapNote => ({
  subjective: '',
  objective: '',
  assessment: '',
  plan: '',
})

const toEditable = (p: Patient): EditablePatient => ({ ...p, soap: blankSoap() })

export function PatientsWorkspace({ patients, globalSearch }: { patients: Patient[]; globalSearch: string; selectedPatient: Patient | null; onSelectPatient: (id: string | null) => void }) {
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', medicalRecordNumber: '', city: '', aiRiskScore: 50 })

  const [patientRecords, setPatientRecords] = useState<EditablePatient[]>(() => {
    const persisted = loadLS<EditablePatient[] | null>('pvcc:v2:patients:crud', null)
    if (persisted) return persisted
    return patients.map(toEditable)
  })

  const filtered = useMemo(() => {
    const q = `${globalSearch} ${query}`.toLowerCase()
    return patientRecords.filter((p) => {
      const riskLevel = mapRisk(p.aiRiskScore)
      return (!q || `${p.name} ${p.medicalRecordNumber} ${p.city}`.toLowerCase().includes(q)) && (risk === 'All' || risk === riskLevel)
    })
  }, [patientRecords, globalSearch, query, risk])

  const selectedPatient = useMemo(() => patientRecords.find((p) => p.id === selectedId) ?? null, [patientRecords, selectedId])

  const saveRecords = (next: EditablePatient[]) => {
    setPatientRecords(next)
    saveLS('pvcc:v2:patients:crud', next)
  }

  const handleCreate = () => {
    if (!form.name.trim() || !form.medicalRecordNumber.trim()) return
    const template = patientRecords[0]
    if (!template) return
    const newPatient: EditablePatient = {
      ...template,
      id: `custom-${Date.now()}`,
      name: form.name,
      medicalRecordNumber: form.medicalRecordNumber,
      city: form.city || 'Medan',
      aiRiskScore: Number(form.aiRiskScore),
      lastVisitDate: new Date().toISOString().slice(0, 10),
      soap: blankSoap(),
    }
    saveRecords([newPatient, ...patientRecords])
    setForm({ name: '', medicalRecordNumber: '', city: '', aiRiskScore: 50 })
  }

  const updatePatientAndSoap = (id: string, patch: Partial<EditablePatient>) => {
    const next = patientRecords.map((p) => (p.id === id ? { ...p, ...patch } : p))
    saveRecords(next)
  }

  const deletePatient = (id: string) => {
    const next = patientRecords.filter((p) => p.id !== id)
    saveRecords(next)
    if (selectedId === id) setSelectedId(null)
  }

  return <div className='space-y-4'>
    <section className='rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Manajemen Pasien (CRUD) + SOAP Mata</h2>
      <p className='mt-1 text-sm text-slate-600'>Tambah, ubah, hapus data pasien, lalu dokumentasikan SOAP kedokteran untuk kasus oftalmologi.</p>
    </section>

    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <p className='mb-3 text-sm font-semibold'>Tambah Pasien Baru</p>
      <div className='grid gap-3 md:grid-cols-4'>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder='Nama pasien' className='h-10 rounded-lg border border-slate-200 px-3 text-sm' />
        <input value={form.medicalRecordNumber} onChange={(e) => setForm({ ...form, medicalRecordNumber: e.target.value })} placeholder='No. RM' className='h-10 rounded-lg border border-slate-200 px-3 text-sm' />
        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder='Kota' className='h-10 rounded-lg border border-slate-200 px-3 text-sm' />
        <input type='number' min={0} max={100} value={form.aiRiskScore} onChange={(e) => setForm({ ...form, aiRiskScore: Number(e.target.value) })} placeholder='Risk Score' className='h-10 rounded-lg border border-slate-200 px-3 text-sm' />
      </div>
      <button onClick={handleCreate} className='mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white'>Tambah Pasien</button>
    </section>

    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='grid gap-3 md:grid-cols-2'>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Cari pasien / RM / kota' className='h-10 rounded-lg border border-slate-200 px-3 text-sm' />
        <select value={risk} onChange={(e) => setRisk(e.target.value)} className='h-10 rounded-lg border border-slate-200 px-3 text-sm'>
          {['All', 'Stable', 'Low', 'Medium', 'High', 'Critical'].map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
    </section>

    <section className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
      <div className='max-h-[420px] overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead className='bg-slate-50 text-slate-600'>
            <tr>
              <th className='px-3 py-2 text-left'>Nama</th><th className='px-3 py-2 text-left'>No. RM</th><th className='px-3 py-2 text-left'>Kota</th><th className='px-3 py-2 text-left'>Risk</th><th className='px-3 py-2 text-left'>Dokter</th><th className='px-3 py-2 text-left'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 40).map((p, i) => {
              const riskLevel = mapRisk(p.aiRiskScore)
              return <tr key={p.id} className='border-t border-slate-100'>
                <td className='px-3 py-2'>
                  <input value={p.name} onChange={(e) => updatePatientAndSoap(p.id, { name: e.target.value })} className='rounded border px-2 py-1' />
                </td>
                <td className='px-3 py-2'>
                  <input value={p.medicalRecordNumber} onChange={(e) => updatePatientAndSoap(p.id, { medicalRecordNumber: e.target.value })} className='rounded border px-2 py-1' />
                </td>
                <td className='px-3 py-2'>
                  <input value={p.city} onChange={(e) => updatePatientAndSoap(p.id, { city: e.target.value })} className='rounded border px-2 py-1' />
                </td>
                <td className='px-3 py-2'><span className={`rounded-full border px-2 py-1 text-xs ${riskTone[riskLevel]}`}>{riskLevel} ({p.aiRiskScore})</span></td>
                <td className='px-3 py-2'>{doctors[i % doctors.length]}</td>
                <td className='px-3 py-2'>
                  <div className='flex gap-2'>
                    <button onClick={() => setSelectedId(p.id)} className='rounded border px-2 py-1 text-xs'>SOAP</button>
                    <button onClick={() => deletePatient(p.id)} className='rounded border border-red-200 px-2 py-1 text-xs text-red-600'>Hapus</button>
                  </div>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </section>

    {selectedPatient && <section className='rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm'>
      <h3 className='text-lg font-semibold text-slate-900'>SOAP Kedokteran Mata - {selectedPatient.name}</h3>
      <p className='mb-3 text-xs text-slate-600'>Contoh kasus mata: keluhan mata kabur, evaluasi visus, IOP, fundus, dan rencana tatalaksana.</p>
      <div className='grid gap-3'>
        {([
          ['subjective', 'S (Subjective)'],
          ['objective', 'O (Objective)'],
          ['assessment', 'A (Assessment)'],
          ['plan', 'P (Plan)'],
        ] as const).map(([key, label]) => <label key={key} className='text-sm'>
          <span className='mb-1 block font-medium'>{label}</span>
          <textarea value={selectedPatient.soap[key]} onChange={(e) => updatePatientAndSoap(selectedPatient.id, { soap: { ...selectedPatient.soap, [key]: e.target.value } })} className='min-h-[88px] w-full rounded-lg border border-slate-200 p-2 text-sm' placeholder={`Isi ${label} untuk kasus mata`} />
        </label>)}
      </div>
      <p className='mt-3 rounded-lg border border-violet-200 bg-violet-50 p-2 text-xs text-violet-700'>AI suggestions require doctor review. Not for autonomous clinical diagnosis.</p>
    </section>}

    <section className='rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600'>
      <p>Template sinyal klinis: {evidenceByIndex[0].join(', ')}. Data review status: {reviewStatuses.join(' / ')}.</p>
    </section>
  </div>
}
