export function FilterTabs({ items, active, onChange }: { items: string[]; active: string; onChange: (v: string) => void }) {
  return <div className="flex flex-wrap gap-2">{items.map((i) => <button key={i} onClick={() => onChange(i)} className={`rounded-full px-3 py-1 text-xs ${active === i ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600'}`}>{i}</button>)}</div>
}
