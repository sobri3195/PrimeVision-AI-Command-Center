import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export function ReferralDistributionChart({ data }: { data: { name: string; value: number }[] }) {
  const c = ['#0F2747', '#C9A227', '#0284c7', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div className="card p-4">
      <h3 className="mb-3 font-semibold text-navy">Referral Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={105} innerRadius={55} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={c[i % c.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
