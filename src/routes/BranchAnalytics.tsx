import { BranchPerformanceChart } from '../components/dashboard/BranchPerformanceChart'
import { PageHeader } from '../components/layout/PageHeader'
import { mockBranches } from '../data/mockBranches'
export function BranchAnalytics() { return <div className="space-y-4"><PageHeader title="Branch Analytics" subtitle="Perbandingan performa cabang dan workload." /><BranchPerformanceChart data={mockBranches} /><div className="card p-4 text-sm">Placeholder: Doctor workload, AI review queue trend, LASIK eligibility chart, post-op alert trend.</div></div> }
