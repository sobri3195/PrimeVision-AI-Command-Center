import { useMemo, useState } from 'react'
import type { Patient } from '../../types/patient'
import { loadLS, saveLS } from '../../utils/localStorage'
import { AlertBanner, ClinicalTimeline, FollowUpScheduler, PatientProfileCard, PatientTableFooter, RiskBadge, TaskBoard } from '../clinic/Modules'
import type { ClinicalPatient, UserRole } from '../clinic/types'

const roles: UserRole[] = ['Doctor', 'Nurse', 'Admin']
const tabs = ['Overview','SOAP','Eye Exam','Imaging','Timeline','Prescription','Follow-up','Referral'] as const
const soapTemplates: Record<string, {subjective:string;objective:string;assessment:string;plan:string}> = { Katarak:{subjective:'Visus buram progresif',objective:'Lens opacity +',assessment:'Suspect cataract',plan:'Biometri dan edukasi operasi'}, Glaukoma:{subjective:'Nyeri mata, halo',objective:'IOP tinggi',assessment:'Suspect glaucoma',plan:'Start glaucoma drop, urgent review'}, 'Diabetic Retinopathy':{subjective:'Penglihatan menurun',objective:'Fundus: mikroaneurisma',assessment:'DR',plan:'OCT/fundus + retina consult'}, AMD:{subjective:'Distorsi sentral',objective:'Macula perubahan drusen',assessment:'AMD',plan:'OCT macula'}, 'Retinal Detachment':{subjective:'Floaters mendadak + curtain vision',objective:'Temuan retina ablasio',assessment:'Suspected RD',plan:'Emergency retina referral'}, 'Dry Eye':{subjective:'Mata kering/perih',objective:'TBUT menurun',assessment:'Dry eye',plan:'Artificial tears + hygiene'}, Uveitis:{subjective:'Nyeri/fotofobia',objective:'AC cell +',assessment:'Uveitis',plan:'Steroid sesuai evaluasi'}, 'Post-op Cataract':{subjective:'Kontrol pasca operasi',objective:'Luka operasi baik',assessment:'Post-op stable',plan:'Lanjut tetes sesuai jadwal'} }

const bootstrap = (p: Patient, idx:number): ClinicalPatient => ({
  id:p.id,name:p.name,medicalRecordNumber:p.medicalRecordNumber,city:p.city,age:45+(idx%30),gender:idx%2?'Male':'Female',doctor:['Dr. Olivia Tan','Dr. Arief Putra','Dr. Shinta Wijaya'][idx%3],chiefComplaint:'Pandangan kabur',activeDiagnosis:'Suspect Cataract',allergies:idx%3?['Tidak ada']:['NSAID'],meds:['Artificial tears'],systemicHistory:idx%2?['diabetes']:['hypertension'],ocularHistory:'Miopia',ocularSurgery:'-',emergencyContact:'Keluarga +62-812-0000',followUpDate:'2026-05-01',followUpReason:'IOP recheck',reminderStatus:'sent',aiRiskScore:p.aiRiskScore,risk:'Medium',riskReasons:['Usia > 60','IOP borderline'],alerts:idx%5===0?[{code:'high_iop',label:'Very high IOP',severity:'high'}]:[],soap:{subjective:'',objective:'',assessment:'',plan:'',approvedByDoctor:false},
  eyeExam:{od:{va:'6/18',bcva:'6/9',iop:'22',pupil:'normal',eom:'normal',conjunctiva:'normal',cornea:'normal',anteriorChamber:'normal',lens:'abnormal',vitreous:'normal',retina:'normal',cdr:'0.5',macula:'normal',peripheralRetina:'normal'},os:{va:'6/24',bcva:'6/12',iop:'24',pupil:'normal',eom:'normal',conjunctiva:'normal',cornea:'normal',anteriorChamber:'normal',lens:'abnormal',vitreous:'normal',retina:'normal',cdr:'0.6',macula:'normal',peripheralRetina:'normal'},octFinding:'Mild RNFL thinning',fundusPhotoFinding:'No acute bleeding',diagnosisImpression:'Glaucoma suspect'},
  timeline:[{date:'2026-04-20',complaint:'Mata kabur',diagnosis:'Cataract',procedure:'Slit lamp',prescription:'Artificial tears',followUp:'1 month',status:'reviewed'}], imaging:[{id:'img1',date:'2026-04-20',type:'OCT',status:'suspicious',note:'RNFL thinning'}], prescriptions:[],procedures:[],referrals:[],auditTrail:[{at:new Date().toISOString(),by:'system',action:'Record initialized'}]
})

export function PatientsWorkspace({ patients, globalSearch }: { patients: Patient[]; globalSearch: string; selectedPatient: Patient | null; onSelectPatient: (id: string | null) => void }) {
  const [role, setRole] = useState<UserRole>('Doctor')
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState<ClinicalPatient[]>(() => loadLS('pvcc:v3:patients', patients.slice(0,20).map(bootstrap)) )
  const [toast, setToast] = useState('')
  const filtered = useMemo(() => records.filter(p => `${globalSearch} ${query} ${p.name} ${p.medicalRecordNumber} ${p.city} ${p.activeDiagnosis}`.toLowerCase().includes(query.toLowerCase())), [records,query,globalSearch])
  const selected = records.find(p=>p.id===selectedId) ?? filtered[0]
  const mutate = (id:string, patch:Partial<ClinicalPatient>, action:string) => { const next = records.map(p=>p.id===id?{...p,...patch,auditTrail:[{at:new Date().toISOString(),by:role,action},...p.auditTrail]}:p); setRecords(next); saveLS('pvcc:v3:patients',next); setToast(action) }

  return <div className='space-y-4'>
    <div className='rounded-2xl border bg-white p-4'><div className='flex items-center justify-between'><h2 className='text-xl font-semibold'>PrimeVision AI Clinical Command Center</h2><select value={role} onChange={e=>setRole(e.target.value as UserRole)} className='rounded border px-2 py-1 text-sm'>{roles.map(r=><option key={r}>{r}</option>)}</select></div><p className='text-xs text-violet-700 mt-2'>AI suggestion, doctor must review. AI does not replace physician judgment.</p></div>
    <TaskBoard patients={records}/>
    <div className='grid gap-4 lg:grid-cols-[1.2fr_1.8fr]'>
      <section className='rounded-2xl border bg-white p-3'>
        <input placeholder='Search name/MRN/city/diagnosis' value={query} onChange={e=>setQuery(e.target.value)} className='mb-2 h-9 w-full rounded border px-2 text-sm'/>
        <div className='max-h-[520px] overflow-auto'><table className='w-full text-sm'><thead className='sticky top-0 bg-slate-50'><tr><th></th><th className='text-left'>Nama</th><th>Risk</th><th>Alert</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id} className='border-t hover:bg-slate-50'><td><input type='checkbox'/></td><td><button className='text-left' onClick={()=>setSelectedId(p.id)}>{p.name}<div className='text-xs text-slate-500'>{p.medicalRecordNumber} • {p.city}</div></button></td><td><RiskBadge risk={p.risk}/></td><td>{p.alerts.length? <span className='text-xs text-red-600'>Red flag</span>:'-'}</td></tr>)}</tbody></table></div>
        <PatientTableFooter page={1} total={filtered.length}/>
      </section>
      {selected && <section className='space-y-3'>
        <AlertBanner alerts={selected.alerts}/>
        <PatientProfileCard p={selected}/>
        <div className='flex flex-wrap gap-2'>{tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`rounded-full px-3 py-1 text-xs ${tab===t?'bg-slate-900 text-white':'bg-slate-100'}`}>{t}</button>)}</div>
        {tab==='Overview' && <div className='rounded-xl border bg-white p-3 text-sm'>Audit trail: {selected.auditTrail.slice(0,4).map(a=>`${a.by} ${a.action}`).join(' • ')}</div>}
        {tab==='SOAP' && <div className='rounded-xl border bg-white p-3 space-y-2'>{Object.keys(soapTemplates).map(k=><button key={k} className='mr-1 rounded border px-2 py-1 text-xs' onClick={()=>mutate(selected.id,{soap:{...selected.soap,...soapTemplates[k]}},`Apply SOAP template ${k}`)}>{k}</button>)}{(['subjective','objective','assessment','plan'] as const).map(f=><textarea key={f} value={selected.soap[f]} disabled={role==='Admin'} onChange={e=>mutate(selected.id,{soap:{...selected.soap,[f]:e.target.value}},`Edit SOAP ${f}`)} className='min-h-16 w-full rounded border p-2 text-sm' placeholder={f}/>) }{role==='Doctor' && <button className='rounded bg-emerald-600 px-3 py-1 text-white text-sm' onClick={()=>mutate(selected.id,{soap:{...selected.soap,approvedByDoctor:true}},'Approve SOAP')}>Approve SOAP</button>}</div>}
        {tab==='Eye Exam' && <div className='grid gap-2 rounded-xl border bg-white p-3 md:grid-cols-2'>{(['od','os'] as const).map(side=><div key={side}><p className='font-semibold uppercase'>{side}</p>{(['va','bcva','iop','pupil','eom','conjunctiva','cornea','anteriorChamber','lens','vitreous','retina','cdr','macula','peripheralRetina'] as const).map(k=><input key={k} disabled={role==='Admin'} className='mb-1 w-full rounded border px-2 py-1 text-xs' value={selected.eyeExam[side][k]} onChange={e=>mutate(selected.id,{eyeExam:{...selected.eyeExam,[side]:{...selected.eyeExam[side],[k]:e.target.value}}},`Edit EyeExam ${side}.${k}`)}/>)}</div>)}</div>}
        {tab==='Imaging' && <div className='grid gap-2 md:grid-cols-2'>{selected.imaging.map(im=><div key={im.id} className='rounded-xl border bg-white p-3 text-sm'><p>{im.type} • {im.date}</p><p className='text-xs'>{im.status}</p><textarea className='mt-2 w-full rounded border p-1 text-xs' value={im.note} onChange={e=>mutate(selected.id,{imaging:selected.imaging.map(x=>x.id===im.id?{...x,note:e.target.value}:x)},'Review Image')}/></div>)}</div>}
        {tab==='Timeline' && <ClinicalTimeline p={selected}/>}        
        {tab==='Prescription' && <div className='rounded-xl border bg-white p-3 text-sm'><button className='rounded border px-2 py-1 text-xs' onClick={()=>mutate(selected.id,{prescriptions:[...selected.prescriptions,{id:Date.now().toString(),name:'Prednisolone',dose:'1 gtt',frequency:'QID',duration:'7 days',instruction:'monitor IOP',category:'steroid'}]},'Add Medication')}>Add Medication</button><div className='mt-2 space-y-1'>{selected.prescriptions.map(rx=><div key={rx.id} className='rounded border p-2'>{rx.name} - {rx.category} {((rx.category==='steroid')&&(Number(selected.eyeExam.od.iop)>21||Number(selected.eyeExam.os.iop)>21))&&<span className='ml-2 text-red-600 text-xs'>Warning steroid on high IOP</span>}</div>)}</div></div>}
        {tab==='Follow-up' && <FollowUpScheduler p={selected} onChange={(d,r)=>mutate(selected.id,{followUpDate:d,followUpReason:r},'Update follow-up')}/>} 
        {tab==='Referral' && <div className='rounded-xl border bg-white p-3 text-sm space-x-2'>{['Refer to Retina Specialist','Refer to Glaucoma Specialist','Refer to Cornea Specialist','Emergency Referral'].map(btn=><button key={btn} className='rounded border px-2 py-1 text-xs' onClick={()=>mutate(selected.id,{referrals:[...selected.referrals,{id:Date.now().toString(),type:btn,reason:selected.activeDiagnosis,status:'pending'}]},btn)}>{btn}</button>)}</div>}
      </section>}
    </div>
    {toast && <div className='fixed bottom-4 right-4 rounded bg-slate-900 px-3 py-2 text-xs text-white'>{toast}</div>}
  </div>
}
