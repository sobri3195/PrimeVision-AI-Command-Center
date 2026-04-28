import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { FilterTabs } from '../components/shared/FilterTabs'

export function DigitalTwin() {
  const [mode, setMode] = useState<'Mode Dokter' | 'Mode Pasien'>('Mode Dokter')
  const [tab, setTab] = useState('Glare')
  const [intensity, setIntensity] = useState(40)

  return (
    <div className="space-y-4">
      <PageHeader title="Digital Twin Mata" subtitle="Simulasi before-after correction untuk komunikasi klinis yang lebih jelas." />
      <div className="card p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterTabs items={['Mode Dokter', 'Mode Pasien']} active={mode} onChange={(v) => setMode(v as typeof mode)} />
          <FilterTabs items={['Glare', 'Halo', 'Dry eye', 'Visual correction']} active={tab} onChange={setTab} />
        </div>
        <label className="block text-sm">
          Simulation slider: {intensity}%
          <input type="range" value={intensity} min={0} max={100} onChange={(e) => setIntensity(Number(e.target.value))} className="mt-2 w-full" />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium">Before</p>
            <div className="flex h-44 items-center justify-center rounded-xl bg-white">Baseline view</div>
          </div>
          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium">After — {tab}</p>
            <div className="flex h-44 items-center justify-center rounded-xl bg-white" style={{ filter: `blur(${(100 - intensity) / 25}px)` }}>
              {mode} preview intensity {intensity}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
