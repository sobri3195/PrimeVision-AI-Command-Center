import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'

const cases = {
  Normal: {
    finding: 'No major anomaly',
    confidence: 92,
    action: 'Routine follow-up 6 months',
    note: 'Retinal layer appears uniform across macular map.',
  },
  'Macular edema': {
    finding: 'Possible intraretinal fluid',
    confidence: 83,
    action: 'Review by retina specialist in 48h',
    note: 'Localized swelling pattern around foveal center.',
  },
  'Retinal thickening': {
    finding: 'Retinal thickening signal',
    confidence: 79,
    action: 'Repeat OCT and correlate with symptoms',
    note: 'Thickness map rises above baseline in parafoveal region.',
  },
}

export function OCTSecondOpinion() {
  const [selectedCase, setSelectedCase] = useState<keyof typeof cases>('Normal')
  const [showOverlay, setShowOverlay] = useState(true)
  const [fileUrl, setFileUrl] = useState('')
  const data = cases[selectedCase]

  return (
    <div className="space-y-4">
      <PageHeader title="AI OCT Second Opinion" subtitle="Prototype only. AI assists review and requires doctor validation." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-navy">OCT Viewer</p>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showOverlay} onChange={(e) => setShowOverlay(e.target.checked)} /> Annotation overlay</label>
          </div>
          <select value={selectedCase} onChange={(e) => setSelectedCase(e.target.value as keyof typeof cases)} className="rounded-xl border p-2 text-sm">
            {Object.keys(cases).map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="file" accept="image/*" onChange={(e) => setFileUrl(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : '')} className="text-sm" />
          <div className="relative flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            {fileUrl ? <img src={fileUrl} alt="OCT upload" className="h-full w-full rounded-2xl object-cover" /> : <p className="text-slate-400">Upload/replace OCT image</p>}
            {showOverlay && <div className="pointer-events-none absolute inset-5 rounded-xl border border-emerald-500/60 bg-emerald-400/10" />}
          </div>
        </div>

        <div className="card p-4 space-y-2 text-sm">
          <h3 className="font-semibold text-navy">Summary</h3>
          <p>Possible finding: <b>{data.finding}</b></p>
          <p>AI confidence: <b>{data.confidence}%</b></p>
          <p>Suggested action: {data.action}</p>
          <p>Interpretation note: {data.note}</p>
        </div>
      </div>
    </div>
  )
}
