import type { Patient } from '../../types/patient'
export function PatientCard({ patient }: { patient: Patient }) { return <div className="card p-5"><h3 className="text-lg font-semibold text-navy">{patient.name}</h3><p className="text-sm text-slate-500">{patient.medicalRecordNumber} · {patient.branch}</p><p className="mt-2 text-sm">Keluhan: {patient.chiefComplaint}</p></div> }
