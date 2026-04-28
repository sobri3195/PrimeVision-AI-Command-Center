import type { Patient } from '../../types/patient'
import { UrgencyBadge } from '../ai/UrgencyBadge'

export function AIPriorityQueue({ patients }: { patients: Patient[] }) {
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-navy">AI Priority Queue</h3>
        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">{patients.slice(0, 8).length} kasus</span>
      </div>
      <div className="space-y-2">
        {patients.slice(0, 8).map((p, idx) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-800">#{idx + 1} {p.name}</p>
              <p className="text-xs text-slate-500">{p.medicalRecordNumber}</p>
            </div>
            <UrgencyBadge urgency={p.aiUrgencyLevel} />
          </div>
        ))}
      </div>
    </div>
  )
}
