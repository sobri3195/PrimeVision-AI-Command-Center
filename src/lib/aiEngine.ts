import type { Patient } from '../types/patient'
import { clamp } from './utils'
import { confidenceFromRisk, lasikEligibilityFromScore, urgencyFromScore } from './scoring'

const vaPenalty = (va: number) => (va < 0.4 ? 18 : va < 0.7 ? 10 : 3)

export function overallEyeRiskScore(p: Patient): number {
  let score = p.age > 60 ? 18 : p.age > 45 ? 10 : 4
  if (p.diabetesStatus) score += 12
  if (p.hypertensionStatus) score += 8
  score += p.intraocularPressureRight > 21 || p.intraocularPressureLeft > 21 ? 13 : 2
  score += vaPenalty((p.visualAcuityRight + p.visualAcuityLeft) / 2)
  score += p.retinaRisk * 0.15 + p.glaucomaRisk * 0.15
  score += p.cataractGrade >= 3 ? 12 : p.cataractGrade * 2
  score += p.octStatus === 'Abnormal' ? 12 : p.octStatus === 'Suspicious' ? 6 : 1
  score += p.fundusStatus === 'Abnormal' ? 10 : p.fundusStatus === 'Suspicious' ? 5 : 1
  return clamp(Math.round(score))
}

export function diabeticRetinopathyRiskScore(p: Patient): number {
  let score = p.diabetesStatus ? 30 : 6
  score += p.age > 55 ? 12 : 5
  score += p.fundusStatus === 'Abnormal' ? 25 : p.fundusStatus === 'Suspicious' ? 12 : 3
  score += vaPenalty((p.visualAcuityRight + p.visualAcuityLeft) / 2)
  score += p.macularEdemaRisk * 0.25
  return clamp(Math.round(score))
}

export function glaucomaRiskScore(p: Patient): number {
  const iop = (p.intraocularPressureRight + p.intraocularPressureLeft) / 2
  let score = iop > 24 ? 35 : iop > 21 ? 22 : 8
  score += p.age > 60 ? 12 : 5
  score += p.octStatus === 'Abnormal' ? 18 : p.octStatus === 'Suspicious' ? 8 : 2
  score += p.age > 50 && Math.random() > 0.6 ? 8 : 2
  score += vaPenalty((p.visualAcuityRight + p.visualAcuityLeft) / 2)
  return clamp(Math.round(score))
}

export function lasikSuitabilityScore(p: Patient): number {
  let score = 78
  score -= p.age > 45 ? 20 : p.age < 19 ? 10 : 2
  score -= Math.abs(p.myopiaDegree) > 8 ? 18 : Math.abs(p.myopiaDegree) > 5 ? 8 : 2
  score -= Math.abs(p.astigmatismDegree) > 3 ? 10 : 2
  score -= p.cornealThickness < 500 ? 22 : p.cornealThickness < 530 ? 8 : 0
  score -= p.pupilSize > 7 ? 10 : 0
  score -= p.dryEyeScore > 70 ? 14 : p.dryEyeScore > 40 ? 6 : 2
  score -= p.topographyStatus === 'Abnormal' ? 20 : p.topographyStatus === 'Borderline' ? 10 : 0
  return clamp(Math.round(score))
}

export function postOpAlertScore(p: Patient): number {
  let score = p.postOpStatus === 'Red Flag' ? 45 : p.postOpStatus === 'Monitoring' ? 22 : 6
  score += /nyeri|kabur|merah/i.test(p.chiefComplaint) ? 18 : 3
  score += Math.random() > 0.7 ? 10 : 2
  score += Math.random() > 0.65 ? 10 : 2
  score += Math.random() > 0.7 ? 9 : 2
  score += Math.floor(Math.random() * 15)
  return clamp(score)
}

export function myopiaProgressionRiskScore(p: Patient): number {
  if (p.age >= 17) return 10
  let score = 20
  score += Math.abs(p.myopiaDegree) > 3 ? 20 : 8
  score += p.axialLength > 24 ? 18 : 7
  score += Math.random() > 0.5 ? 15 : 6
  score += Math.random() > 0.5 ? 12 : 5
  score += Math.random() > 0.5 ? 10 : 4
  return clamp(score)
}

export function enrichPatientWithAI(p: Patient): Patient {
  const overall = overallEyeRiskScore(p)
  const lasikScore = lasikSuitabilityScore(p)
  const glaucoma = glaucomaRiskScore(p)
  const dr = diabeticRetinopathyRiskScore(p)
  return {
    ...p,
    aiRiskScore: overall,
    aiUrgencyLevel: urgencyFromScore(overall),
    aiConfidence: confidenceFromRisk(overall),
    glaucomaRisk: glaucoma,
    diabeticRetinopathyRisk: dr,
    lasikEligibility: lasikEligibilityFromScore(lasikScore),
  }
}
