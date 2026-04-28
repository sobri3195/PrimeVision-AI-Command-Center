import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Toast } from '../components/shared/Toast'

const templates: Record<string, Record<string, string[]>> = {
  Indonesia: {
    LASIK: ['Apa itu tindakan ini: LASIK membentuk ulang kornea untuk mengurangi minus/silinder.', 'Manfaat: Penglihatan lebih jelas dan ketergantungan kacamata berkurang.', 'Risiko: Mata kering sementara, silau malam, butuh kontrol rutin.', 'Persiapan: Hentikan lensa kontak, lakukan pemeriksaan lengkap.', 'Pemulihan: Istirahat visual 24 jam dan gunakan tetes sesuai instruksi.'],
    Katarak: ['Apa itu tindakan ini: Operasi mengganti lensa keruh dengan lensa buatan.', 'Manfaat: Penglihatan lebih terang dan tajam.', 'Risiko: Infeksi jarang, inflamasi, butuh kontrol pasca operasi.', 'Persiapan: Pemeriksaan biometri dan tekanan mata.', 'Pemulihan: Tetes rutin, hindari mengucek mata, kontrol terjadwal.'],
  },
  English: {
    LASIK: ['What is this procedure: LASIK reshapes the cornea to reduce refractive error.', 'Benefits: Better unaided vision and faster daily activity.', 'Risks: Temporary dryness, glare, and review requirements.', 'Preparation: Stop contact lens and complete pre-op panel.', 'Recovery: Short visual rest and follow doctor medication plan.'],
    Katarak: ['What is this procedure: Cataract surgery replaces cloudy lens with artificial IOL.', 'Benefits: Improved contrast and visual clarity.', 'Risks: Inflammation, infection (rare), regular review needed.', 'Preparation: Biometry and retinal check.', 'Recovery: Eye drops, no eye rubbing, scheduled follow-up.'],
  },
}

export function PatientEducator() {
  const [country, setCountry] = useState<'Indonesia' | 'English'>('Indonesia')
  const [topic, setTopic] = useState<'LASIK' | 'Katarak'>('LASIK')
  const [output, setOutput] = useState<string[]>([])
  const [toast, setToast] = useState('')

  const generate = () => setOutput(templates[country][topic])

  const copy = async () => {
    await navigator.clipboard.writeText(output.join('\n'))
    setToast('Explanation copied to clipboard')
    setTimeout(() => setToast(''), 1500)
  }

  return (
    <div className="space-y-4">
      <PageHeader title="AI Patient Educator" subtitle="Generate family-friendly explanation in selectable language and topic." />
      <div className="card p-5 space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <select value={country} onChange={(e) => setCountry(e.target.value as typeof country)} className="h-11 rounded-xl border border-slate-200 px-3"><option>Indonesia</option><option>English</option></select>
          <select value={topic} onChange={(e) => setTopic(e.target.value as typeof topic)} className="h-11 rounded-xl border border-slate-200 px-3"><option>LASIK</option><option>Katarak</option></select>
          <button onClick={generate} className="rounded-xl bg-navy px-4 py-2 text-white">Generate Explanation</button>
        </div>

        {output.length === 0 ? <p className="text-sm text-slate-500">No generated explanation yet.</p> : (
          <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
            {output.map((line) => <p key={line}>{line}</p>)}
            <div className="pt-2 space-x-2">
              <button onClick={copy} className="rounded-lg border px-3 py-1.5">Copy to clipboard</button>
              <button onClick={generate} className="rounded-lg bg-white px-3 py-1.5 border">Regenerate</button>
            </div>
          </div>
        )}
      </div>
      <Toast message={toast} />
    </div>
  )
}
