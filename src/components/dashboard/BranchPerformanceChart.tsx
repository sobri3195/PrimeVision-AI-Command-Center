import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { BranchMetrics } from '../../types/branch'
export function BranchPerformanceChart({ data }: { data: BranchMetrics[] }) { return <div className="card p-4"><h3 className="mb-3 font-semibold text-navy">Branch Performance</h3><div className="h-64"><ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="avgRisk" fill="#0F2747" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div></div> }
