import { Activity, BarChart3, Bot, Brain, Building2, LayoutDashboard, Settings, Stethoscope } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const groups = [
  { title: 'Operations', items: [['/', 'Dashboard', LayoutDashboard], ['/patients', 'Patients', Activity], ['/branch-analytics', 'Branches', Building2]] },
  { title: 'Clinical AI', items: [['/retina-screening', 'Retina AI', Brain], ['/oct-second-opinion', 'OCT Review', Bot], ['/surgical-coach', 'Surgical Coach', Stethoscope]] },
  { title: 'Analytics', items: [['/lasik-score', 'LASIK', BarChart3], ['/digital-twin', 'Digital Twin', Bot]] },
  { title: 'Settings', items: [['/settings', 'Platform Settings', Settings]] },
] as const

export function Sidebar() {
  return <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block"><div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-900">PrimeVision AI Command Center</p><p className="mt-1 text-xs text-slate-500">Clinical intelligence for eye care operations</p></div><nav className="space-y-4">{groups.map((g) => <div key={g.title}><p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{g.title}</p><div className="space-y-1">{g.items.map(([to, label, Icon]) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}><Icon className="h-4 w-4" />{label}</NavLink>)}</div></div>)}</nav></aside>
}
