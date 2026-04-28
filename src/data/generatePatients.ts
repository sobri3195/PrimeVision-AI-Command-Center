import { BRANCHES, CITIES, SPECIALISTS } from '../lib/constants'
import { pick } from '../lib/utils'
import type { Patient } from '../types/patient'
import { enrichPatientWithAI } from '../lib/aiEngine'

const male = ['Ahmad', 'Budi', 'Dimas', 'Rizky', 'Fajar', 'Rangga', 'Ilham', 'Arif', 'Yusuf', 'Andika']
const female = ['Siti', 'Ayu', 'Nadia', 'Putri', 'Intan', 'Rani', 'Devi', 'Lestari', 'Nabila', 'Fitri']
const last = ['Saputra', 'Siregar', 'Lubis', 'Harahap', 'Pratama', 'Wijaya', 'Nasution', 'Simatupang', 'Hutabarat', 'Ginting']
const complaints = ['Penglihatan kabur', 'Mata merah', 'Silau malam', 'Mata kering', 'Sakit kepala', 'Nyeri mata', 'Kontrol pasca operasi']

export function generatePatients(total = 10000): Patient[] {
  return Array.from({ length: total }, (_, i) => {
    const age = 8 + Math.floor(Math.random() * 72)
    const gender = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan'
    const first = gender === 'Laki-laki' ? pick(male) : pick(female)
    const base: Patient = {
      id: `P-${i + 1}`,
      medicalRecordNumber: `MRN-${String(100000 + i)}`,
      name: `${first} ${pick(last)}`,
      gender,
      age,
      phone: `08${Math.floor(1000000000 + Math.random() * 8999999999)}`,
      city: pick(CITIES),
      branch: pick(BRANCHES),
      lastVisitDate: new Date(Date.now() - Math.floor(Math.random() * 200) * 86400000).toISOString().slice(0, 10),
      chiefComplaint: pick(complaints),
      diagnosisHistory: ['Dry Eye', 'Refractive Error'].slice(0, Math.floor(Math.random() * 2) + 1),
      diabetesStatus: Math.random() > 0.72,
      hypertensionStatus: Math.random() > 0.68,
      visualAcuityRight: Number((0.2 + Math.random() * 0.8).toFixed(2)),
      visualAcuityLeft: Number((0.2 + Math.random() * 0.8).toFixed(2)),
      intraocularPressureRight: 12 + Math.floor(Math.random() * 16),
      intraocularPressureLeft: 12 + Math.floor(Math.random() * 16),
      cataractGrade: Math.floor(Math.random() * 5),
      glaucomaRisk: 0,
      retinaRisk: Math.floor(Math.random() * 100),
      diabeticRetinopathyRisk: 0,
      macularEdemaRisk: Math.floor(Math.random() * 100),
      myopiaDegree: Number((-(Math.random() * 10)).toFixed(2)),
      astigmatismDegree: Number((Math.random() * 4).toFixed(2)),
      cornealThickness: 470 + Math.floor(Math.random() * 110),
      pupilSize: Number((2 + Math.random() * 6).toFixed(1)),
      dryEyeScore: Math.floor(Math.random() * 100),
      axialLength: Number((21 + Math.random() * 6).toFixed(2)),
      lasikInterest: Math.random() > 0.4,
      lasikEligibility: 'Need Further Evaluation',
      octStatus: pick(['Normal', 'Suspicious', 'Abnormal'] as const),
      fundusStatus: pick(['Normal', 'Suspicious', 'Abnormal'] as const),
      topographyStatus: pick(['Normal', 'Borderline', 'Abnormal'] as const),
      postOpStatus: pick(['Stable', 'Monitoring', 'Red Flag'] as const),
      aiRiskScore: 0,
      aiUrgencyLevel: 'Low',
      aiConfidence: 0,
      recommendedSpecialist: pick(SPECIALISTS),
      recommendedAction: 'AI menemukan potensi risiko tinggi. Mohon lakukan validasi dokter.',
      doctorReviewStatus: Math.random() > 0.65 ? 'Pending' : 'Reviewed',
    }
    return enrichPatientWithAI(base)
  })
}
