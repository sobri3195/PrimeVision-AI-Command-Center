import {
  Activity,
  Bot,
  Brain,
  Building2,
  Eye,
  Gauge,
  LayoutDashboard,
  ScanEye,
  Settings,
  ShieldAlert,
  Stethoscope,
  UserSquare2,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/patients', 'Patients', Users],
  ['/retina-screening', 'Retina', Eye],
  ['/oct-second-opinion', 'OCT', ScanEye],
  ['/lasik-score', 'LASIK', Gauge],
  ['/digital-twin', 'Digital Twin', Bot],
  ['/post-op-guardian', 'Post-Op', ShieldAlert],
  ['/surgical-coach', 'Surgical Coach', Stethoscope],
  ['/patient-educator', 'Patient Educator', UserSquare2],
  ['/myopia-control', 'Myopia', Activity],
  ['/branch-analytics', 'Branch Analytics', Building2],
  ['/settings', 'Settings', Settings],
] as const

function Brand() {
  return (
    <div className="glass-panel mb-6 rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="PrimeVision AI logo" className="h-8 w-8 shrink-0" />
        <div>
          <p className="gradient-text text-sm font-semibold">PrimeVision AI</p>
          <p className="text-xs text-slate-500">Command Center</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">Clinical intelligence platform untuk mempercepat keputusan dokter dengan workflow yang lebih cepat dan presisi.</p>
    </div>
  )
}

export function Sidebar() {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/40 bg-white/65 p-4 backdrop-blur-2xl lg:block">
        <Brand />
        <nav className="space-y-1">
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-gradient-to-r from-navy to-sky-700 text-white shadow-soft'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`
              }
            >
              <Icon size={16} className="opacity-85" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <nav className="sticky top-0 z-30 border-b border-white/40 bg-white/80 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="mb-2 flex items-center gap-2">
          <img src="/logo.svg" alt="PrimeVision AI logo" className="h-6 w-6 shrink-0" />
          <p className="gradient-text text-sm font-semibold">PrimeVision AI</p>
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs ${
                  isActive
                    ? 'border-navy bg-navy text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
