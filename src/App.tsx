import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { mockPatients } from './data/mockPatients'
import { BranchAnalytics } from './routes/BranchAnalytics'
import { Dashboard } from './routes/Dashboard'
import { DigitalTwin } from './routes/DigitalTwin'
import { LASIKScore } from './routes/LASIKScore'
import { MyopiaControl } from './routes/MyopiaControl'
import { OCTSecondOpinion } from './routes/OCTSecondOpinion'
import { PatientDetail } from './routes/PatientDetail'
import { PatientEducator } from './routes/PatientEducator'
import { Patients } from './routes/Patients'
import { PostOpGuardian } from './routes/PostOpGuardian'
import { RetinaScreening } from './routes/RetinaScreening'
import { Settings } from './routes/Settings'
import { SurgicalCoach } from './routes/SurgicalCoach'
import type { DoctorRole } from './types/ai'

function App() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<DoctorRole>((localStorage.getItem('pv_role') as DoctorRole) || 'Doctor')
  useEffect(() => localStorage.setItem('pv_role', role), [role])

  return <div className="flex min-h-screen bg-slate-50 text-slate-800"><Sidebar /><div className="flex-1"><Topbar search={search} setSearch={setSearch} role={role} setRole={setRole} /><main className="p-4 md:p-6"><Routes>
    <Route path="/" element={<Dashboard patients={mockPatients} />} />
    <Route path="/patients" element={<Patients patients={mockPatients} globalSearch={search} />} />
    <Route path="/patients/:id" element={<PatientDetail patients={mockPatients} />} />
    <Route path="/retina-screening" element={<RetinaScreening />} />
    <Route path="/oct-second-opinion" element={<OCTSecondOpinion />} />
    <Route path="/lasik-score" element={<LASIKScore />} />
    <Route path="/digital-twin" element={<DigitalTwin />} />
    <Route path="/post-op-guardian" element={<PostOpGuardian />} />
    <Route path="/surgical-coach" element={<SurgicalCoach />} />
    <Route path="/patient-educator" element={<PatientEducator />} />
    <Route path="/myopia-control" element={<MyopiaControl />} />
    <Route path="/branch-analytics" element={<BranchAnalytics />} />
    <Route path="/settings" element={<Settings role={role} />} />
    <Route path="*" element={<Navigate to='/' replace />} />
  </Routes></main></div></div>
}

export default App
