import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Eye,
  HeartPulse,
  Microscope,
  ShieldAlert,
  Stethoscope,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { AICommandBar } from '../components/dashboard/AICommandBar'
import { KPIGrid } from '../components/dashboard/KPIGrid'
import { AIInsightsPanel } from '../components/dashboard/AIInsightsPanel'
import { PriorityQueue } from '../components/dashboard/PriorityQueue'
import { BranchPerformanceChart } from '../components/dashboard/BranchPerformanceChart'
import { ExplainabilityPanel } from '../components/dashboard/ExplainabilityPanel'
import type { Patient } from '../types/patient'

const quickPrompts = ['Critical patients', 'Follow-up overdue', 'Branch anomaly', 'Doctor review needed']

export function Dashboard({ patients, globalSearch = '' }: { patients: Patient[]; globalSearch?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [period, setPeriod] = useState<'Today' | 'Weekly' | 'Monthly'>('Weekly')

  const filtered = useMemo(
    () => patients.filter((p) => !globalSearch || `${p.name} ${p.medicalRecordNumber} ${p.branch}`.toLowerCase().includes(globalSearch.toLowerCase())),
    [patients, globalSearch],
  )

  const queue = useMemo(() => [...filtered].sort((a, b) => b.aiRiskScore - a.aiRiskScore).slice(0, 10), [filtered])
  const selected = queue.find((p) => p.id === selectedId) || queue[0] || null

  const kpis: { label: string; value: string | number; trend: string; micro: string; icon: any; tone: 'critical' | 'high' | 'review' | 'stable' }[] = [
    { label: 'Critical Patients', value: filtered.filter((p) => p.aiUrgencyLevel === 'Critical').length, trend: '+12%', micro: 'vs yesterday', icon: AlertTriangle, tone: 'critical' },
    { label: 'Doctor Review Required', value: filtered.filter((p) => p.doctorReviewStatus === 'Pending').length, trend: '+7%', micro: 'awaiting sign-off', icon: Stethoscope, tone: 'high' },
    { label: 'Follow-up Compliance', value: '89.3%', trend: '+8.2%', micro: 'week over week', icon: CheckCircle2, tone: 'stable' },
    { label: 'Post-op Red Flags', value: filtered.filter((p) => p.postOpStatus === 'Red Flag').length, trend: '-3%', micro: 'improved this week', icon: ShieldAlert, tone: 'review' },
    { label: 'Retina Screening', value: filtered.filter((p) => p.diabetesStatus).length, trend: '+5%', micro: 'high-priority due', icon: Eye, tone: 'stable' },
    { label: 'LASIK Eligible', value: filtered.filter((p) => p.lasikEligibility === 'Eligible').length, trend: '+4%', micro: 'candidate pipeline', icon: Microscope, tone: 'stable' },
    { label: 'Branch Performance Score', value: '84.6', trend: '-1.2%', micro: 'vs network average', icon: HeartPulse, tone: 'review' },
    { label: 'AI Confidence', value: '96.2%', trend: '+0.8%', micro: 'validated model confidence', icon: BrainCircuit, tone: 'stable' },
  ]

  const insights = [
    { severity: 'Critical', confidence: 97, text: '45 patients require urgent review based on retina/OCT anomaly signals.', action: 'Escalate to retina team within 2 hours.' },
    { severity: 'Stable', confidence: 92, text: 'Follow-up compliance improved 8.2% this week.', action: 'Maintain reminder cadence and monitor no-show rate.' },
    { severity: 'High', confidence: 88, text: 'Prime Center Nana Rohana shows lower screening throughput than branch average.', action: 'Rebalance technician and imaging slots tomorrow morning.' },
    { severity: 'Review', confidence: 94, text: '320 post-op patients have elevated red flag indicators.', action: 'Initiate nurse triage and same-day doctor review for top quartile.' },
  ] as const

  const branchData = [
    { branch: 'Nana Rohana', score: 72, avg: 78, trend: 70 },
    { branch: 'Jakarta Selatan', score: 88, avg: 78, trend: 84 },
    { branch: 'Bandung Central', score: 81, avg: 78, trend: 80 },
    { branch: 'Surabaya West', score: 76, avg: 78, trend: 77 },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="PrimeVision AI Command Center" subtitle="AI-powered clinical operations dashboard for eye care centers" />
      <AICommandBar prompts={quickPrompts} />
      <KPIGrid items={kpis} />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AIInsightsPanel insights={insights} />
        <div className="card p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Operational Intelligence</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            {['AI Triage Assistant', 'Natural language clinical search', 'Automated shift handover summary', 'Follow-up gap detection', 'Branch anomaly detection', 'Doctor workload balancing', 'Patient education recommendation', 'Surgical coach insight', 'Post-op red flag monitor', 'AI audit log'].map((f) => (
              <li key={f} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><span>{f}</span><span className="text-teal-700">Enabled</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 2xl:grid-cols-[1.25fr_1fr_0.9fr]">
        <PriorityQueue data={queue} onSelect={setSelectedId} selectedId={selected?.id || null} />
        <BranchPerformanceChart data={branchData} period={period} setPeriod={setPeriod} />
        <ExplainabilityPanel patient={selected} />
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">AI suggestions require doctor review. Not for autonomous clinical diagnosis.</div>
    </div>
  )
}
