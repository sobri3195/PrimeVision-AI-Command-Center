import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { AIRecommendationPanel } from '../components/patient/AIRecommendationPanel'
import { EyeExamSummary } from '../components/patient/EyeExamSummary'
import { ImagingPreview } from '../components/patient/ImagingPreview'
import { PatientCard } from '../components/patient/PatientCard'
import { PatientTimeline } from '../components/patient/PatientTimeline'
import { EmptyState } from '../components/shared/EmptyState'
import type { Patient } from '../types/patient'

export function PatientDetail({ patients }: { patients: Patient[] }) {
  const { id } = useParams()
  const p = patients.find(x => x.id === id)
  if (!p) return <EmptyState title="Patient not found" />
  return <div className="space-y-4"><PageHeader title="Patient Detail" subtitle="Keputusan klinis tetap berada pada dokter spesialis mata." /><div className="grid gap-4 xl:grid-cols-3"><div className="space-y-4 xl:col-span-2"><PatientCard patient={p} /><EyeExamSummary patient={p} /><AIRecommendationPanel patient={p} /></div><div className="space-y-4"><ImagingPreview label="Fundus / OCT" /><PatientTimeline /></div></div></div>
}
