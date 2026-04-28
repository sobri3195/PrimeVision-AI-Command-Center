import { Link } from 'react-router-dom'
import type { Patient } from '../../types/patient'
import { DataTable } from '../shared/DataTable'
import { RiskBadge } from '../ai/RiskBadge'

export function PatientRiskTable({ patients }: { patients: Patient[] }) {
  return <DataTable headers={['Pasien', 'Cabang', 'Skor', 'Aksi']}>
    {patients.slice(0, 10).map(p => <tr key={p.id} className="border-t border-slate-100"><td className="px-4 py-3">{p.name}</td><td className="px-4 py-3">{p.branch}</td><td className="px-4 py-3"><RiskBadge score={p.aiRiskScore} /></td><td className="px-4 py-3"><Link className="text-navy underline" to={`/patients/${p.id}`}>Detail</Link></td></tr>)}
  </DataTable>
}
