import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'

export function LASIKScore() {
  const [form, setForm] = useState({ age: 28, cornealThickness: 520, dryEyeScore: 30, refractiveStability: 2 })
  const [result, setResult] = useState<{ score: number; status: string; recommendation: string } | null>(null)

  const generate = () => {
    const score = Math.max(
      0,
      Math.min(
        100,
        100 - Math.abs(form.age - 28) * 0.9 + (form.cornealThickness - 480) * 0.2 - form.dryEyeScore * 0.55 + form.refractiveStability * 10,
      ),
    )
    const status = score >= 75 ? 'Eligible' : score >= 50 ? 'Need Further Evaluation' : 'Not Suitable Yet'
    const recommendation =
      status === 'Eligible'
        ? 'Proceed to pre-operative panel and informed consent.'
        : status === 'Need Further Evaluation'
          ? 'Require additional dry eye and corneal mapping review.'
          : 'Optimize ocular surface and reassess in 3 months.'
    setResult({ score: Math.round(score), status, recommendation })
  }

  return (
    <div className="space-y-4">
      <PageHeader title="AI LASIK Suitability Score" subtitle="Hasil simulasi awal. Keputusan klinis final tetap oleh dokter." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 space-y-3 text-sm">
          <h3 className="font-semibold text-navy">Input Clinical Parameters</h3>
          {([
            ['age', 'Usia', 10, 70],
            ['cornealThickness', 'Corneal thickness (µm)', 420, 620],
            ['dryEyeScore', 'Dry eye score', 0, 100],
            ['refractiveStability', 'Refractive stability (years)', 0, 5],
          ] as const).map(([key, label, min, max]) => (
            <label key={key} className="block">
              <span className="mb-1 block text-slate-600">{label}</span>
              <input
                type="number"
                min={min}
                max={max}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3"
              />
            </label>
          ))}
          <button onClick={generate} className="rounded-xl bg-navy px-4 py-2 text-white">Generate Score</button>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-navy">Result</h3>
          {!result && <p className="mt-3 text-sm text-slate-500">No score yet. Submit parameters to generate eligibility.</p>}
          {result && (
            <div className="mt-3 space-y-3 text-sm">
              <p>LASIK eligibility score: <b>{result.score}</b></p>
              <div className="h-3 w-full rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-navy" style={{ width: `${result.score}%` }} />
              </div>
              <p>Status: <span className="rounded-full bg-slate-100 px-2 py-1">{result.status}</span></p>
              <p>Recommendation: {result.recommendation}</p>
              <p>Candidate pathway: {result.score >= 75 ? 'LASIK standard protocol' : 'Surface correction / optimization pathway'}</p>
              <p>Risk factors: dry eye level and corneal thickness remain key determinants.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
