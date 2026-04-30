import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DoctorReviewBanner } from '../components/ai/DoctorReviewBanner'
import { UrgencyBadge } from '../components/ai/UrgencyBadge'
import { PageHeader } from '../components/layout/PageHeader'
import { FilterTabs } from '../components/shared/FilterTabs'
import { PatientDrawer } from '../components/shared/PatientDrawer'
import type { Patient } from '../types/patient'

export function Dashboard({ patients, globalSearch = '' }: { patients: Patient[]; globalSearch?: string }) {
  const [branch, setBranch] = useState('All')
  const [urgency, setUrgency] = useState('All')
  const [queueTab, setQueueTab] = useState('All')
  const [range, setRange] = useState<'Hari ini' | 'Mingguan' | 'Bulanan'>('Mingguan')
  const [selected, setSelected] = useState<Patient | null>(null)

  const filtered = useMemo(
    () =>
      patients.filter(
        (p) =>
          (branch === 'All' || p.branch === branch) &&
          (urgency === 'All' || p.aiUrgencyLevel === urgency) &&
          (!globalSearch || `${p.name} ${p.medicalRecordNumber} ${p.branch} ${p.city}`.toLowerCase().includes(globalSearch.toLowerCase())),
      ),
    [patients, branch, urgency, globalSearch],
  )

  const stats = {
    'SLA Review': `${Math.max(81, 100 - Math.round((filtered.filter((p) => p.doctorReviewStatus === 'Pending').length / Math.max(filtered.length, 1)) * 100))}%`,
    'Akurasi AI': '96.2%',
    'Kepatuhan Follow-up': '89%',
    'Total Pasien': filtered.length,
    Critical: filtered.filter((p) => p.aiUrgencyLevel === 'Critical').length,
    High: filtered.filter((p) => p.aiUrgencyLevel === 'High').length,
    'Doctor Review': filtered.filter((p) => p.doctorReviewStatus === 'Pending').length,
    'LASIK Eligible': filtered.filter((p) => p.lasikEligibility === 'Eligible').length,
    'Diabetes Retina Screening': filtered.filter((p) => p.diabetesStatus && p.diabeticRetinopathyRisk >= 60).length,
    'Post-op Red Flag': filtered.filter((p) => p.postOpStatus === 'Red Flag').length,
  }

  const queue = [...filtered]
    .filter((p) => (queueTab === 'Review' ? p.doctorReviewStatus === 'Pending' : queueTab === 'All' ? true : p.aiUrgencyLevel === queueTab))
    .sort((a, b) => b.aiRiskScore - a.aiRiskScore)
    .slice(0, 8)

  const performance = useMemo(() => {
    const byBranch = Array.from(new Set(patients.map((p) => p.branch))).map((b) => {
      const d = patients.filter((p) => p.branch === b)
      const multiplier = range === 'Hari ini' ? 0.8 : range === 'Bulanan' ? 1.25 : 1
      return {
        name: b,
        score: Math.round((d.reduce((acc, x) => acc + x.aiRiskScore, 0) / Math.max(d.length, 1)) * multiplier),
      }
    })
    return byBranch
  }, [patients, range])

  const tone = (label: string) => {
    if (label.includes('Critical') || label.includes('Red Flag')) return 'text-rose-700 bg-rose-50'
    if (label.includes('High') || label.includes('Review')) return 'text-amber-700 bg-amber-50'
    if (label.includes('Akurasi') || label.includes('SLA')) return 'text-emerald-700 bg-emerald-50'
    return 'text-sky-700 bg-sky-50'
  }

  return (
    <div className="space-y-5">
      <PageHeader title="PrimeVision AI Command Center" subtitle="AI-powered clinical dashboard for eye care operations" />
      <DoctorReviewBanner />

      <div className="grid gap-3 lg:grid-cols-2">
        <FilterTabs items={['All', ...Array.from(new Set(patients.map((p) => p.branch)))]} active={branch} onChange={setBranch} />
        <FilterTabs items={['All', 'Low', 'Medium', 'High', 'Critical']} active={urgency} onChange={setUrgency} />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="card p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tone(label)}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-navy">AI Priority Queue</h3>
            <FilterTabs items={['All', 'Critical', 'High', 'Review']} active={queueTab} onChange={setQueueTab} />
          </div>
          <div className="space-y-2">
            {queue.map((p, idx) => (
              <button
                key={p.id}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-left hover:border-navy/20"
                onClick={() => setSelected(p)}
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">#{idx + 1} {p.name}</p>
                  <p className="text-xs text-slate-500">{p.medicalRecordNumber}</p>
                </div>
                <UrgencyBadge urgency={p.aiUrgencyLevel} />
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-navy">Branch Performance</h3>
            <FilterTabs items={['Hari ini', 'Mingguan', 'Bulanan']} active={range} onChange={(v) => setRange(v as typeof range)} />
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={performance} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="score" fill="#0F2747" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <PatientDrawer patient={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
