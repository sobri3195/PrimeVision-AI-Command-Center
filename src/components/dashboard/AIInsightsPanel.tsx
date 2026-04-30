const badge: Record<string, string> = {
  Critical: 'bg-rose-50 text-rose-700 border-rose-200',
  High: 'bg-amber-50 text-amber-700 border-amber-200',
  Review: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Stable: 'bg-teal-50 text-teal-700 border-teal-200',
}
export function AIInsightsPanel({ insights }: { insights: readonly { severity: 'Critical' | 'High' | 'Review' | 'Stable'; confidence: number; text: string; action: string }[] }) {
  return <section className="card p-4"><h3 className="mb-3 text-sm font-semibold">AI Clinical Insights</h3><div className="space-y-2">{insights.map((i) => <div key={i.text} className="rounded-xl border border-slate-200 bg-white p-3"><div className="mb-2 flex items-center justify-between"><span className={`rounded-full border px-2 py-0.5 text-[11px] ${badge[i.severity]}`}>{i.severity}</span><span className="text-xs text-slate-500">Confidence {i.confidence}%</span></div><p className="text-sm text-slate-800">{i.text}</p><p className="mt-1 text-xs text-slate-500"><b>Suggested action:</b> {i.action}</p><button className="mt-2 text-xs font-medium text-teal-700 hover:underline">Review Evidence</button></div>)}</div></section>
}
