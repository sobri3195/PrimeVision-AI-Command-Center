import { clamp } from './utils'

export const urgencyFromScore = (score: number) => (score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low') as const

export const lasikEligibilityFromScore = (score: number) =>
  (score >= 75 ? 'Eligible' : score >= 50 ? 'Need Further Evaluation' : 'Not Recommended') as const

export const confidenceFromRisk = (risk: number) => clamp(55 + risk * 0.35)
