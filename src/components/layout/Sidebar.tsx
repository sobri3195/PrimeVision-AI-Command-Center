import { NavLink } from 'react-router-dom'
const links = [
  ['/', 'Dashboard'], ['/patients', 'Patients'], ['/retina-screening', 'Retina'], ['/oct-second-opinion', 'OCT'], ['/lasik-score', 'LASIK'], ['/digital-twin', 'Digital Twin'], ['/post-op-guardian', 'Post-Op'], ['/surgical-coach', 'Surgical Coach'], ['/patient-educator', 'Patient Educator'], ['/myopia-control', 'Myopia'], ['/branch-analytics', 'Branch Analytics'], ['/settings', 'Settings']
]
export function Sidebar() {
  return <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block"><p className="mb-4 text-sm font-semibold text-gold">PrimeVision AI</p><nav className="space-y-1">{links.map(([to, label]) => <NavLink key={to} to={to} className={({isActive}) => `block rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{label}</NavLink>)}</nav></aside>
}
