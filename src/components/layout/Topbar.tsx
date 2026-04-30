import { Bell } from 'lucide-react'
import type { DoctorRole } from '../../types/ai'
import { SearchInput } from '../shared/SearchInput'

export function Topbar({
  search,
  setSearch,
  role,
  setRole,
  notificationsEnabled,
}: {
  search: string
  setSearch: (v: string) => void
  role: DoctorRole
  setRole: (v: DoctorRole) => void
  notificationsEnabled: boolean
}) {
  const roles: DoctorRole[] = ['Doctor', 'Admin', 'Reviewer']
  const now = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="z-20 border-b border-white/40 bg-white/70 p-4 backdrop-blur-2xl md:sticky md:top-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search patient, MRN, branch, clinical keyword..." />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as DoctorRole)}
            className="h-11 rounded-2xl border border-white/70 bg-white/90 px-4 text-sm shadow-sm outline-none transition focus:border-sky-200 focus:ring-2 focus:ring-sky-100"
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 font-medium text-emerald-700">System Online</span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-slate-600">{now}</span>
          <button
            className={`rounded-full border bg-white p-2 hover:bg-slate-50 ${notificationsEnabled ? 'border-emerald-300 text-emerald-600' : 'border-slate-200 text-slate-400'}`}
            title={notificationsEnabled ? 'AI urgent alert enabled' : 'AI urgent alert disabled'}
          >
            <Bell size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}
