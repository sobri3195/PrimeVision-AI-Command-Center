import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { BranchMetrics } from '../../types/branch'

export function BranchPerformanceChart({ data }: { data: BranchMetrics[] }) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-semibold text-navy">Branch Performance</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="avgRisk" fill="#0F2747" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
