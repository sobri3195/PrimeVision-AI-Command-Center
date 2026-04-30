import { useEffect, useMemo, useState } from 'react'
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
import { loadLS, saveLS } from './utils/localStorage'

function App() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<DoctorRole>(loadLS<DoctorRole>('pvcc:v1:user:role', 'Doctor'))
  const [notificationsEnabled, setNotificationsEnabled] = useState(loadLS<boolean>('pvcc:v1:ui:notifications', true))
  const [compactMode, setCompactMode] = useState(loadLS<boolean>('pvcc:v1:ui:compact', false))
  const [theme, setTheme] = useState<'light' | 'dark'>(loadLS<'light' | 'dark'>('pvcc:v1:ui:theme', 'light'))

  useEffect(() => saveLS('pvcc:v1:user:role', role), [role])
  useEffect(() => saveLS('pvcc:v1:ui:notifications', notificationsEnabled), [notificationsEnabled])
  useEffect(() => saveLS('pvcc:v1:ui:compact', compactMode), [compactMode])
  useEffect(() => saveLS('pvcc:v1:ui:theme', theme), [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === 'pvcc:v1:ui:theme') setTheme(loadLS<'light' | 'dark'>('pvcc:v1:ui:theme', 'light'))
      if (event.key === 'pvcc:v1:ui:compact') setCompactMode(loadLS<boolean>('pvcc:v1:ui:compact', false))
    }

    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const shellClasses = useMemo(() => `${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'} ${compactMode ? 'text-[13px]' : ''} transition-colors duration-500`, [theme, compactMode])

  return (
    <div className={`flex min-h-screen ${shellClasses}`}>
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,162,39,0.16),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(15,39,71,0.12),transparent_28%)]" />
      <div className="pointer-events-none fixed -left-20 top-24 -z-0 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none fixed -right-16 bottom-16 -z-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
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
            <Route path="/settings" element={<Settings role={role} notif={notificationsEnabled} compact={compactMode} theme={theme} setTheme={setTheme} setNotif={setNotificationsEnabled} setCompact={setCompactMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
