import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Toast } from '../components/shared/Toast'

const symptoms = [
  ['Nyeri berat', 3],
  ['Penglihatan menurun mendadak', 4],
  ['Mata sangat merah', 2],
  ['Fotofobia', 2],
  ['Mual / sakit kepala hebat', 2],
] as const

export function PostOpGuardian() {
  const [operation, setOperation] = useState('LASIK')
  const [checked, setChecked] = useState<string[]>([])
  const [toast, setToast] = useState('')

  const score = useMemo(() => checked.reduce((acc, item) => acc + (symptoms.find(([label]) => label === item)?.[1] ?? 0), 0), [checked])
  const alert = score >= 7 ? 'Critical red flag' : score >= 4 ? 'Need doctor review' : 'Stable monitoring'

  const message = `Halo Bapak/Ibu, berdasarkan follow-up ${operation}, keluhan Anda termasuk ${alert}. Mohon segera kontrol ke klinik PrimeVision.`

  return (
    <div className="space-y-4">
      <PageHeader title="AI Post-Op Guardian" subtitle="Monitoring keluhan pasca operasi dan rekomendasi eskalasi." />
      <div className="card p-5 space-y-4">
        <div className="grid gap-3 lg:grid-cols-2">
          <select value={operation} onChange={(e) => setOperation(e.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm">
            <option>LASIK</option><option>Katarak</option><option>Retina</option><option>Glaukoma</option>
          </select>
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">Alert red flag patient count: {score >= 7 ? 12 : 4}</p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {symptoms.map(([label]) => (
            <label key={label} className="rounded-xl border border-slate-200 p-3 text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={checked.includes(label)}
                onChange={(e) => setChecked((prev) => (e.target.checked ? [...prev, label] : prev.filter((x) => x !== label)))}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-sm">
          <p>Rule-based score: <b>{score}</b></p>
          <p>Status: <b className={score >= 7 ? 'text-rose-600' : score >= 4 ? 'text-amber-600' : 'text-emerald-600'}>{alert}</b></p>
          <p className="mt-2">WhatsApp template output:</p>
          <textarea value={message} readOnly className="mt-2 h-24 w-full rounded-xl border border-slate-200 p-3" />
        </div>

        <button onClick={() => { setToast('Escalation sent to Doctor Queue'); setTimeout(() => setToast(''), 1600) }} className="rounded-xl bg-rose-600 px-4 py-2 text-white">Escalate to Doctor</button>
      </div>
      <Toast message={toast} />
    </div>
  )
}
