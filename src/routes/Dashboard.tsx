import { AIPriorityQueue } from '../components/dashboard/AIPriorityQueue'
import { BranchPerformanceChart } from '../components/dashboard/BranchPerformanceChart'
import { PatientRiskTable } from '../components/dashboard/PatientRiskTable'
import { ReferralDistributionChart } from '../components/dashboard/ReferralDistributionChart'
import { RiskSummaryCards } from '../components/dashboard/RiskSummaryCards'
import { DoctorReviewBanner } from '../components/ai/DoctorReviewBanner'
import { PageHeader } from '../components/layout/PageHeader'
import { mockBranches } from '../data/mockBranches'
import type { Patient } from '../types/patient'

export function Dashboard({ patients }: { patients: Patient[] }) {
  const critical = patients.filter(p => p.aiUrgencyLevel === 'Critical').length
  const high = patients.filter(p => p.aiUrgencyLevel === 'High').length
  const review = patients.filter(p => p.doctorReviewStatus === 'Pending').length
  const lasik = patients.filter(p => p.lasikEligibility === 'Eligible').length
  const diabeticScreen = patients.filter(p => p.diabetesStatus && p.diabeticRetinopathyRisk >= 60).length
  const postOp = patients.filter(p => p.postOpStatus === 'Red Flag').length
  const referral = Object.entries(patients.reduce<Record<string, number>>((a, p) => ((a[p.recommendedSpecialist] = (a[p.recommendedSpecialist] || 0) + 1), a), {})).map(([name, value]) => ({ name, value }))
  const sorted = [...patients].sort((a,b)=>b.aiRiskScore-a.aiRiskScore)
  return <div className="space-y-5"><PageHeader title="PrimeVision AI Command Center" subtitle="AI-powered clinical dashboard for eye care operations" /><DoctorReviewBanner /><RiskSummaryCards stats={{ 'Total pasien': patients.length, Critical: critical, High: high, 'Doctor review': review, 'LASIK eligible': lasik, 'Diabetes retina screening': diabeticScreen, 'Post-op red flag': postOp }} /><div className="grid gap-5 xl:grid-cols-2"><AIPriorityQueue patients={sorted} /><BranchPerformanceChart data={mockBranches} /></div><div className="grid gap-5 xl:grid-cols-2"><ReferralDistributionChart data={referral} /><PatientRiskTable patients={sorted} /></div></div>
}
