import { DoctorReviewBanner } from '../components/ai/DoctorReviewBanner'
import { AIExplainabilityBox } from '../components/ai/AIExplainabilityBox'
import { ImagingPreview } from '../components/patient/ImagingPreview'
import { PageHeader } from '../components/layout/PageHeader'
export function RetinaScreening() { return <div className="space-y-4"><PageHeader title="AI Retina Screening" subtitle="Pasien ini disarankan untuk evaluasi retina." /><DoctorReviewBanner /><div className="grid gap-4 lg:grid-cols-2"><ImagingPreview label="Simulated Fundus Image" /><div className="card p-4 space-y-2"><p className="text-sm">Status: <b>Refer to Retina Specialist</b></p><p className="text-sm">Diabetic Retinopathy Risk: <b>78</b></p><AIExplainabilityBox text="AI detected vascular abnormalities pada simulasi fundus. Mohon validasi dokter retina." /><button className="rounded-xl bg-navy px-4 py-2 text-sm text-white">Schedule retina consultation</button></div></div></div> }
