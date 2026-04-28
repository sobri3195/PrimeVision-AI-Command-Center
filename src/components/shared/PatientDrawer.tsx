import type { Patient } from '../../types/patient'
import { UrgencyBadge } from '../ai/UrgencyBadge'

export function PatientDrawer({ patient, onClose }: { patient: Patient | null; onClose: () => void }) {
  if (!patient) return null

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-navy">Patient Detail</h3>
          <button className="rounded-lg border px-2 py-1 text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="font-semibold">{patient.name}</p>
            <p className="text-slate-500">{patient.medicalRecordNumber} · {patient.branch}</p>
          </div>
          <p><b>Kota:</b> {patient.city}</p>
          <p><b>AI Risk Score:</b> {patient.aiRiskScore}</p>
          <div className="flex items-center gap-2"><b>Urgency:</b> <UrgencyBadge urgency={patient.aiUrgencyLevel} /></div>
          <p><b>Review Status:</b> {patient.doctorReviewStatus}</p>
          <p><b>Recommendation:</b> {patient.recommendedAction}</p>
          <p><b>Disclaimer:</b> Prototype only. AI assists screening and review workflow. Final clinical decision remains with the doctor.</p>
        </div>
      </aside>
    </div>
  )
}
