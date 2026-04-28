import { motion } from 'framer-motion'

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return <motion.div whileHover={{ y: -2 }} className="card p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-navy">{value}</p>{hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}</motion.div>
}
