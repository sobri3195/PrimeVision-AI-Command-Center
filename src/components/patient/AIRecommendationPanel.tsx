import type { Patient } from '../../types/patient'
import { ConfidenceMeter } from '../ai/ConfidenceMeter'
import { DoctorReviewBanner } from '../ai/DoctorReviewBanner'
export function AIRecommendationPanel({ patient }: { patient: Patient }) { return <div className="card p-4"><DoctorReviewBanner /><p className="mt-3 text-sm">{patient.recommendedAction}</p><p className="mt-1 text-sm font-medium">Specialist: {patient.recommendedSpecialist}</p><div className="mt-3"><ConfidenceMeter value={patient.aiConfidence} /></div><button className="mt-4 rounded-xl bg-navy px-4 py-2 text-sm text-white">Doctor Review Required</button></div> }
