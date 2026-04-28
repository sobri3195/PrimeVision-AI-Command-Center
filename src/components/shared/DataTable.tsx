import type { ReactNode } from 'react'

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return <div className="card overflow-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr>{headers.map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>
}
