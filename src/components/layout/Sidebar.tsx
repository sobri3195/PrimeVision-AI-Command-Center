import { NavLink } from 'react-router-dom'

const links = [
  ['/', 'Dashboard'],
  ['/patients', 'Patients'],
  ['/retina-screening', 'Retina'],
  ['/oct-second-opinion', 'OCT'],
  ['/lasik-score', 'LASIK'],
  ['/digital-twin', 'Digital Twin'],
  ['/post-op-guardian', 'Post-Op'],
  ['/surgical-coach', 'Surgical Coach'],
  ['/patient-educator', 'Patient Educator'],
  ['/myopia-control', 'Myopia'],
  ['/branch-analytics', 'Branch Analytics'],
  ['/settings', 'Settings'],
]

function Brand() {
  return (
    <div className="mb-4 flex items-center gap-3">
      <img src="/logo.svg" alt="PrimeVision AI logo" className="h-8 w-8 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-gold">PrimeVision AI</p>
        <p className="text-xs text-slate-500">Command Center</p>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
        <Brand />
        <nav className="space-y-1">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
        <div className="mb-2 flex items-center gap-2">
          <img src="/logo.svg" alt="PrimeVision AI logo" className="h-6 w-6 shrink-0" />
          <p className="text-sm font-semibold text-gold">PrimeVision AI</p>
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
