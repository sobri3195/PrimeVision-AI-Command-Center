import { useMemo, useState } from 'react'
import { DoctorReviewBanner } from '../components/ai/DoctorReviewBanner'
import { PageHeader } from '../components/layout/PageHeader'

const presets = {
  mild: { label: 'Mild finding', risk: 48, status: 'Review in 2 weeks' },
  moderate: { label: 'Moderate NPDR', risk: 72, status: 'Refer to Retina Specialist' },
  severe: { label: 'Severe DR signal', risk: 91, status: 'Urgent retina referral' },
}

export function RetinaScreening() {
  const [fileUrl, setFileUrl] = useState('')
  const [preset, setPreset] = useState<keyof typeof presets>('moderate')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ risk: number; status: string; label: string } | null>(null)

  const active = useMemo(() => result ?? presets[preset], [result, preset])

  const runAnalysis = () => {
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(presets[preset])
      setLoading(false)
    }, 1300)
  }

  return (
    <div className="space-y-4">
      <PageHeader title="AI Retina Screening" subtitle="Pasien ini disarankan untuk evaluasi retina." />
      <DoctorReviewBanner />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4 space-y-3">
          <p className="font-semibold text-navy">Fundus Viewer</p>
          <select className="rounded-xl border p-2 text-sm" value={preset} onChange={(e) => setPreset(e.target.value as keyof typeof presets)}>
            <option value="mild">Sample: Mild</option>
            <option value="moderate">Sample: Moderate</option>
            <option value="severe">Sample: Severe</option>
          </select>
          <input type="file" accept="image/*" onChange={(e) => setFileUrl(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : '')} className="text-sm" />
          <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            {fileUrl ? <img src={fileUrl} alt="uploaded fundus" className="h-full w-full rounded-2xl object-cover" /> : <p className="text-slate-400">Upload preview simulation</p>}
          </div>
          <button onClick={runAnalysis} className="rounded-xl bg-navy px-4 py-2 text-sm text-white">Run AI Analysis</button>
        </div>

        <div className="card p-4 space-y-3">
          <h3 className="font-semibold text-navy">AI Result Summary</h3>
          {loading ? <div className="rounded-xl bg-slate-100 p-4 text-sm">Analyzing retina image...</div> : null}
          {!loading && (
            <>
              <p className="text-sm">Status: <b>{active.status}</b></p>
              <p className="text-sm">Diabetic Retinopathy Risk score: <b>{active.risk}</b></p>
              <p className="text-sm text-slate-600">{active.label}. AI detected vascular pattern changes and suggests specialist verification.</p>
              <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white">Schedule retina consultation</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
