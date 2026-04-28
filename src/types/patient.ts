import type { LasikEligibility, UrgencyLevel } from './ai'

export interface Patient {
  id: string
  medicalRecordNumber: string
  name: string
  gender: 'Laki-laki' | 'Perempuan'
  age: number
  phone: string
  city: string
  branch: string
  lastVisitDate: string
  chiefComplaint: string
  diagnosisHistory: string[]
  diabetesStatus: boolean
  hypertensionStatus: boolean
  visualAcuityRight: number
  visualAcuityLeft: number
  intraocularPressureRight: number
  intraocularPressureLeft: number
  cataractGrade: number
  glaucomaRisk: number
  retinaRisk: number
  diabeticRetinopathyRisk: number
  macularEdemaRisk: number
  myopiaDegree: number
  astigmatismDegree: number
  cornealThickness: number
  pupilSize: number
  dryEyeScore: number
  axialLength: number
  lasikInterest: boolean
  lasikEligibility: LasikEligibility
  octStatus: 'Normal' | 'Suspicious' | 'Abnormal'
  fundusStatus: 'Normal' | 'Suspicious' | 'Abnormal'
  topographyStatus: 'Normal' | 'Borderline' | 'Abnormal'
  postOpStatus: 'Stable' | 'Monitoring' | 'Red Flag'
  aiRiskScore: number
  aiUrgencyLevel: UrgencyLevel
  aiConfidence: number
  recommendedSpecialist: 'Retina' | 'Glaukoma' | 'Katarak' | 'Refraktif/LASIK' | 'Pediatric/Myopia' | 'General Ophthalmology'
  recommendedAction: string
  doctorReviewStatus: 'Pending' | 'Reviewed'
}
