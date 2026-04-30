import { Activity, Bot, Brain, Building2, ChevronLeft, LayoutDashboard, Settings, ShieldCheck, Stethoscope } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const groups = [
  { title: 'Command Center', items: [['/', 'Overview', LayoutDashboard], ['/patients', 'Patients', Activity]] },
  { title: 'Clinical Modules', items: [['/retina-screening', 'Retina AI', Brain], ['/oct-second-opinion', 'OCT Review', Bot], ['/post-op-guardian', 'Post-op Guardian', ShieldCheck], ['/surgical-coach', 'Surgical Coach', Stethoscope]] },
  { title: 'Intelligence', items: [['/branch-analytics', 'Branch Analytics', Building2]] },
  { title: 'Administration', items: [['/settings', 'Platform Settings', Settings]] },
] as const

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  return <aside className={`sticky top-0 hidden h-screen shrink-0 border-r border-slate-200 bg-white px-3 py-4 lg:block ${collapsed ? 'w-20' : 'w-72'}`}>
    <button onClick={() => setCollapsed((v) => !v)} className='mb-3 rounded-lg border p-1'><ChevronLeft className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`} /></button>
    <div className='mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3'><p className='text-sm font-semibold'>{collapsed ? 'PV' : 'PrimeVision AI'}</p>{!collapsed && <p className='text-xs text-slate-500'>Clinical command center</p>}</div>
    <nav className='space-y-4'>{groups.map((g) => <div key={g.title}><p className='mb-1 px-2 text-[11px] uppercase tracking-wide text-slate-400'>{!collapsed && g.title}</p><div className='space-y-1'>{g.items.map(([to, label, Icon]) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}><Icon className='h-4 w-4' />{!collapsed && label}</NavLink>)}</div></div>)}</nav>
    <div className='absolute bottom-4 left-3 right-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs'>Prime Center Aksara</div>
  </aside>
}
