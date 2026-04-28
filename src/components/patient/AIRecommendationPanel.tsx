import type { Patient } from '../../types/patient'
import { buildAIHighlights } from '../../lib/aiEngine'
import { AIExplainabilityBox } from '../ai/AIExplainabilityBox'
import { ConfidenceMeter } from '../ai/ConfidenceMeter'
import { DoctorReviewBanner } from '../ai/DoctorReviewBanner'

export function AIRecommendationPanel({ patient }: { patient: Patient }) {
  const highlights = buildAIHighlights(patient)
  return <div className="card space-y-3 p-4"><DoctorReviewBanner /><p className="text-sm">{patient.recommendedAction}</p><p className="text-sm font-medium">Specialist: {patient.recommendedSpecialist}</p><div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700"><p className="font-semibold text-slate-800">AI Feature Snapshot</p><ul className="mt-2 list-disc space-y-1 pl-4">{highlights.map(item => <li key={item}>{item}</li>)}</ul></div><AIExplainabilityBox text="Rekomendasi AI menggunakan kombinasi data anamnesis, tekanan bola mata, kualitas visus, serta temuan OCT/fundus. Keputusan terapi tetap divalidasi dokter." /><div><ConfidenceMeter value={patient.aiConfidence} /></div><button className="rounded-xl bg-navy px-4 py-2 text-sm text-white">Doctor Review Required</button></div>
}
