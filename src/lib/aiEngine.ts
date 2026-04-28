import type { Patient } from '../types/patient'
import { clamp } from './utils'
import { confidenceFromRisk, lasikEligibilityFromScore, urgencyFromScore } from './scoring'

const vaPenalty = (va: number) => (va < 0.4 ? 18 : va < 0.7 ? 10 : 3)
const seededNoise = (seed: string, min: number, max: number) => {
  const hash = Array.from(seed).reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 3), 0)
  const normalized = Math.abs(Math.sin(hash))
  return Math.round(min + normalized * (max - min))
}

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
  score += p.age > 50 ? seededNoise(`${p.id}-glaucoma-age`, 2, 8) : 2
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
  score += seededNoise(`${p.id}-post-op-1`, 2, 10)
  score += seededNoise(`${p.id}-post-op-2`, 2, 10)
  score += seededNoise(`${p.id}-post-op-3`, 2, 9)
  score += seededNoise(`${p.id}-post-op-4`, 0, 14)
  return clamp(score)
}

export function myopiaProgressionRiskScore(p: Patient): number {
  if (p.age >= 17) return 10
  let score = 20
  score += Math.abs(p.myopiaDegree) > 3 ? 20 : 8
  score += p.axialLength > 24 ? 18 : 7
  score += seededNoise(`${p.id}-myopia-1`, 6, 15)
  score += seededNoise(`${p.id}-myopia-2`, 5, 12)
  score += seededNoise(`${p.id}-myopia-3`, 4, 10)
  return clamp(score)
}

export function buildAIHighlights(p: Patient): string[] {
  const avgVa = ((p.visualAcuityLeft + p.visualAcuityRight) / 2).toFixed(2)
  return [
    `Skor risiko total ${p.aiRiskScore} dengan prioritas ${p.aiUrgencyLevel}.`,
    `Tekanan intraokular R/L ${p.intraocularPressureRight}/${p.intraocularPressureLeft} mmHg dan status OCT ${p.octStatus}.`,
    `Rata-rata visus ${avgVa} dengan status fundus ${p.fundusStatus}.`,
    `Prediksi kelayakan LASIK: ${p.lasikEligibility}.`,
  ]
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
