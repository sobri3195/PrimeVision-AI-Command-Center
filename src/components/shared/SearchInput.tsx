export function SearchInput({ value, onChange, placeholder = 'Cari...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-navy focus:outline-none" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
}
