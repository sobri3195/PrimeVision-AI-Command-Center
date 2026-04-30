import type { DoctorRole } from '../types/ai'
import { PageHeader } from '../components/layout/PageHeader'

export function Settings({ role, notif, compact, setNotif, setCompact }: { role: DoctorRole; notif: boolean; compact: boolean; setNotif: (v: boolean) => void; setCompact: (v: boolean) => void }) {

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="User preferences, notification settings, theme controls, and role display." />
      <div className="card p-5 space-y-4 text-sm">
        <p>Current role display: <b>{role}</b></p>
        <details className="rounded-xl border p-3" open>
          <summary className="cursor-pointer font-medium">Notification settings</summary>
          <label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={notif} onChange={(e) => setNotif(e.target.checked)} />Enable AI urgent alert notification</label>
        </details>
        <details className="rounded-xl border p-3">
          <summary className="cursor-pointer font-medium">Theme settings</summary>
          <label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />Use compact density layout</label>
        </details>
        <details className="rounded-xl border p-3">
          <summary className="cursor-pointer font-medium">Clinical safety note</summary>
          <p className="mt-2 text-slate-600">Prototype only. AI assists screening and review workflow. Final clinical decision remains with the doctor.</p>
        </details>
      </div>
    </div>
  )
}
