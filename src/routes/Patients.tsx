import { useMemo, useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import type { Patient } from '../types/patient'
import { PatientsWorkspace } from '../components/patientsWorkspace/PatientsWorkspace'

export function Patients({ patients, globalSearch }: { patients: Patient[]; globalSearch: string }) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)

  const selectedPatient = useMemo(() => patients.find((p) => p.id === selectedPatientId) ?? null, [patients, selectedPatientId])

  return <PatientsWorkspace patients={patients} globalSearch={globalSearch} selectedPatient={selectedPatient} onSelectPatient={setSelectedPatientId} />
}
