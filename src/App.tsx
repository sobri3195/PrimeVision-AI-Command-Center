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
  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem('pv_notif') !== 'false')
  const [compactMode, setCompactMode] = useState(localStorage.getItem('pv_compact') === 'true')

  useEffect(() => localStorage.setItem('pv_role', role), [role])
  useEffect(() => localStorage.setItem('pv_notif', String(notificationsEnabled)), [notificationsEnabled])
  useEffect(() => localStorage.setItem('pv_compact', String(compactMode)), [compactMode])

  return (
    <div className={`flex min-h-screen bg-slate-100 text-slate-800 ${compactMode ? 'text-[13px]' : ''}`}>
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,162,39,0.14),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(15,39,71,0.12),transparent_28%)]" />
      <Sidebar />
      <div className="relative z-10 flex-1">
        <Topbar search={search} setSearch={setSearch} role={role} setRole={setRole} notificationsEnabled={notificationsEnabled} />
        <main className={compactMode ? 'p-3 md:p-4' : 'p-4 md:p-6'}>
          <Routes>
            <Route path="/" element={<Dashboard patients={mockPatients} globalSearch={search} />} />
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
            <Route path="/settings" element={<Settings role={role} notif={notificationsEnabled} compact={compactMode} setNotif={setNotificationsEnabled} setCompact={setCompactMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
