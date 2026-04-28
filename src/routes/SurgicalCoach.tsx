import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { FilterTabs } from '../components/shared/FilterTabs'

export function SurgicalCoach() {
  const [tab, setTab] = useState('Overview')
  const timeline = ['Pre-op setup completed', 'Incision stability 88%', 'Lens alignment validated', 'Post-op checklist ready']

  return (
    <div className="space-y-4">
      <PageHeader title="AI Surgical Coach" subtitle="Simulation analytics for procedure stability and complication prevention." />
      <FilterTabs items={['Overview', 'Metrics', 'Notes']} active={tab} onChange={setTab} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex h-64 items-center justify-center rounded-xl bg-slate-900 text-slate-200">Dummy surgery video player area</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">Stability score: <b>88</b></div>
            <div className="rounded-xl bg-amber-50 p-3">Complication risk: <b>Medium</b></div>
            <div className="rounded-xl bg-emerald-50 p-3">Training analytics: <b>Improving</b></div>
          </div>
        </div>
        <div className="card p-5 text-sm">
          <h3 className="font-semibold text-navy">Timeline Progress</h3>
          <ul className="mt-3 space-y-2">
            {timeline.map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 p-2">{item}</li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">Recommendation: Increase microscope stability drill for next 3 sessions.</div>
        </div>
      </div>
    </div>
  )
}
