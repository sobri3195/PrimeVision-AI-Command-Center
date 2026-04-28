import type { BranchMetrics } from '../types/branch'

export const mockBranches: BranchMetrics[] = [
  { name: 'Prime Center Nana Rohana', patients: 2800, avgRisk: 62, lasikEligible: 790, retinaReferral: 415, postOpAlert: 132, workload: 78, reviewQueue: 206 },
  { name: 'Prime Center A. Yani', patients: 2500, avgRisk: 58, lasikEligible: 750, retinaReferral: 350, postOpAlert: 118, workload: 72, reviewQueue: 184 },
  { name: 'Prime Center Aksara', patients: 2400, avgRisk: 55, lasikEligible: 710, retinaReferral: 330, postOpAlert: 95, workload: 69, reviewQueue: 165 },
  { name: 'Prime Executive', patients: 2300, avgRisk: 51, lasikEligible: 820, retinaReferral: 290, postOpAlert: 84, workload: 64, reviewQueue: 142 }
]
