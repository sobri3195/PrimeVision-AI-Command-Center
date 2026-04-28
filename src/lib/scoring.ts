import type { LasikEligibility, UrgencyLevel } from '../types/ai'
import { clamp } from './utils'

export const urgencyFromScore = (score: number): UrgencyLevel =>
  score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'

export const lasikEligibilityFromScore = (score: number): LasikEligibility =>
  score >= 75 ? 'Eligible' : score >= 50 ? 'Need Further Evaluation' : 'Not Recommended'

export const confidenceFromRisk = (risk: number) => clamp(55 + risk * 0.35)
