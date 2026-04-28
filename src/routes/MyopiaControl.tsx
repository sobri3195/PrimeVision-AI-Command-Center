import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'

export function MyopiaControl() {
  const [form, setForm] = useState({ age: 10, myopia: -2, axialLength: 24.6, screenTime: 4, outdoor: 1 })
  const [risk, setRisk] = useState<{ level: string; score: number; plan: string[] } | null>(null)

  const calculate = () => {
    const score = Math.round(
      Math.abs(form.myopia) * 12 + (form.axialLength - 23) * 14 + form.screenTime * 8 + Math.max(0, 3 - form.outdoor) * 10 + (12 - form.age),
    )
    const level = score >= 70 ? 'High' : score >= 45 ? 'Medium' : 'Low'
    const plan =
      level === 'High'
        ? ['Kontrol 1 bulan', 'Pertimbangkan atropine low-dose', 'Tambah aktivitas outdoor > 2 jam/hari']
        : level === 'Medium'
          ? ['Kontrol 3 bulan', 'Pantau axial length', 'Kurangi screen time malam hari']
          : ['Kontrol 6 bulan', 'Pertahankan kebiasaan visual sehat']
    setRisk({ level, score, plan })
  }

  return (
    <div className="space-y-4">
      <PageHeader title="AI Myopia Control" subtitle="Risk scoring anak untuk jadwal intervensi dan follow-up." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 space-y-3 text-sm">
          {([
            ['age', 'Usia'],
            ['myopia', 'Derajat myopia'],
            ['axialLength', 'Axial length'],
            ['screenTime', 'Screen time (jam/hari)'],
            ['outdoor', 'Outdoor activity (jam/hari)'],
          ] as const).map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1 block text-slate-600">{label}</span>
              <input type="number" value={form[key]} onChange={(e) => setForm((prev) => ({ ...prev, [key]: Number(e.target.value) }))} className="h-11 w-full rounded-xl border border-slate-200 px-3" />
            </label>
          ))}
          <button onClick={calculate} className="rounded-xl bg-navy px-4 py-2 text-white">Calculate Risk</button>
        </div>

        <div className="card p-5 text-sm">
          {!risk ? <p className="text-slate-500">Submit parameters to generate risk level and recommendation timeline.</p> : (
            <div className="space-y-3">
              <p>Risk score: <b>{risk.score}</b></p>
              <p>Risk level: <span className="rounded-full bg-slate-100 px-2 py-1">{risk.level}</span></p>
              <p className="font-medium">Recommended control schedule</p>
              <ul className="space-y-2">
                {risk.plan.map((step) => <li key={step} className="rounded-xl bg-slate-50 p-2">{step}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
