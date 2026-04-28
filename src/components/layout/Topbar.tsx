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
  const roles: DoctorRole[] = ['Doctor', 'Optometrist', 'Nurse', 'Admin', 'Management']
  const now = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="z-20 border-b border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl md:sticky md:top-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari pasien, MRN, kota, diagnosa..." />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as DoctorRole)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">System Online</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{now}</span>
        </div>
      </div>
    </header>
  )
}
