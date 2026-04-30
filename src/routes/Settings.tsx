import { useEffect, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import type { DoctorRole } from '../types/ai'
import { loadLS, saveLS } from '../utils/localStorage'

type KpiPrefs = {
  queueAlertThreshold: number
}

export function Settings({
  role,
  notif,
  compact,
  theme,
  setTheme,
  setNotif,
  setCompact,
}: {
  role: DoctorRole
  notif: boolean
  compact: boolean
  theme: 'light' | 'dark'
  setTheme: (v: 'light' | 'dark') => void
  setNotif: (v: boolean) => void
  setCompact: (v: boolean) => void
}) {
  const [kpi, setKpi] = useState<KpiPrefs>(loadLS<KpiPrefs>('pvcc:v1:kpi:alerts', { queueAlertThreshold: 20 }))

  useEffect(() => {
    saveLS('pvcc:v1:kpi:alerts', kpi)
  }, [kpi])

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="User preferences, notification settings, theme controls, and role display." />
      <div className="card space-y-4 p-5 text-sm">
        <p>
          Current role display: <b>{role}</b>
        </p>
        <details className="rounded-xl border p-3" open>
          <summary className="cursor-pointer font-medium">Notification settings</summary>
          <label className="mt-2 flex items-center gap-2">
            <input type="checkbox" checked={notif} onChange={(e) => setNotif(e.target.checked)} />Enable AI urgent alert notification
          </label>
        </details>
        <details className="rounded-xl border p-3" open>
          <summary className="cursor-pointer font-medium">Theme & density settings</summary>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={theme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />Use dark mode
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />Use compact density layout
            </label>
          </div>
        </details>
        <details className="rounded-xl border p-3" open>
          <summary className="cursor-pointer font-medium">KPI alert preferences</summary>
          <label className="mt-2 block">
            Queue alert threshold
            <input
              type="number"
              min={1}
              value={kpi.queueAlertThreshold}
              onChange={(e) => setKpi((prev) => ({ ...prev, queueAlertThreshold: Number(e.target.value) || 1 }))}
              className="mt-1 h-10 w-full max-w-xs rounded-xl border border-slate-200 px-3"
            />
          </label>
        </details>
        <details className="rounded-xl border p-3">
          <summary className="cursor-pointer font-medium">Clinical safety note</summary>
          <p className="mt-2 text-slate-600">
            Prototype only. AI assists screening and review workflow. Final clinical decision remains with the doctor.
          </p>
        </details>
      </div>
    </div>
  )
}
