import { SearchInput } from '../shared/SearchInput'
import type { DoctorRole } from '../../types/ai'

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

  return (
    <header className="z-20 border-b border-slate-200 bg-white/90 p-4 backdrop-blur md:sticky md:top-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari pasien, MRN, kota..." />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as DoctorRole)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
    </header>
  )
}
