export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type UserRole = 'Doctor' | 'Nurse' | 'Admin'

export type SoapNote = { subjective: string; objective: string; assessment: string; plan: string; approvedByDoctor: boolean }
export type AlertItem = { code: string; label: string; severity: 'critical' | 'high' }

export type EyeExamSide = {
  va: string; bcva: string; iop: string; pupil: string; eom: string; conjunctiva: string; cornea: string; anteriorChamber: string; lens: string; vitreous: string; retina: string; cdr: string; macula: string; peripheralRetina: string
}

export type ClinicalPatient = {
  id: string; name: string; medicalRecordNumber: string; city: string; age: number; gender: 'Male'|'Female'; doctor: string; chiefComplaint: string; activeDiagnosis: string; allergies: string[]; meds: string[]; systemicHistory: string[]; ocularHistory: string; ocularSurgery: string; emergencyContact: string; followUpDate: string; followUpReason: string; reminderStatus: 'sent'|'pending'; aiRiskScore: number; risk: RiskLevel; riskReasons: string[]; alerts: AlertItem[]; soap: SoapNote; eyeExam: {od: EyeExamSide; os: EyeExamSide; octFinding: string; fundusPhotoFinding: string; diagnosisImpression: string}; timeline: Array<{date:string; complaint:string; diagnosis:string; procedure:string; prescription:string; followUp:string; status:'reviewed'|'pending'|'escalated'}>;
  imaging: Array<{id:string; date:string; type:'OCT'|'Fundus Photo'|'Visual Field'|'Anterior Segment'; status:'normal'|'suspicious'|'urgent'; note:string}>;
  prescriptions: Array<{id:string; name:string; dose:string; frequency:string; duration:string; instruction:string; category:'antibiotic'|'steroid'|'NSAID'|'glaucoma drop'|'artificial tears'}>;
  procedures: Array<{id:string; type:string; indication:string; eye:'OD'|'OS'|'Bilateral'; priority:'low'|'medium'|'high'; consent:'pending'|'signed'; targetDate:string; preOpNote:string}>;
  referrals: Array<{id:string; type:string; reason:string; status:'pending'|'accepted'|'done'}>;
  auditTrail: Array<{at:string; by:string; action:string}>;
}
