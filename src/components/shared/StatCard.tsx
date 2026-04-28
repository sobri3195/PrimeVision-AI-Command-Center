import { motion } from 'framer-motion'

const intentStyles: Record<string, string> = {
  critical: 'from-rose-50 to-white border-rose-100',
  high: 'from-amber-50 to-white border-amber-100',
  review: 'from-sky-50 to-white border-sky-100',
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  const key = label.toLowerCase()
  const intent = key.includes('critical') ? 'critical' : key.includes('high') ? 'high' : key.includes('review') ? 'review' : ''

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-soft ${intentStyles[intent] || 'from-white to-slate-50 border-slate-100'}`}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </motion.div>
  )
}
