import { Bell } from 'lucide-react'
import type { DoctorRole } from '../../types/ai'
import { SearchInput } from '../shared/SearchInput'

export function Topbar({
  search,
  setSearch,
  role,
  setRole,
}: {
  search: string
  setSearch: (v: string) => void
  role: DoctorRole
  setRole: (v: DoctorRole) => void
}) {
  const roles: DoctorRole[] = ['Doctor', 'Admin', 'Reviewer']
  const now = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="z-20 border-b border-slate-200/70 bg-white/90 p-4 backdrop-blur-xl md:sticky md:top-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search patient, MRN, branch, clinical keyword..." />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as DoctorRole)}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm shadow-sm"
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">System Online</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{now}</span>
          <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50">
            <Bell size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}
