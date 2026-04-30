import { Sparkles } from 'lucide-react'

export function AICommandBar({ prompts }: { prompts: string[] }) {
  return (
    <section className="card p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Sparkles className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-teal-600" />
          <input className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-teal-500/40 transition focus:ring-2" placeholder="Ask AI: show high-risk retina patients, follow-up gaps, LASIK candidates…" />
        </div>
        <button className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800">Run AI Analysis</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {prompts.map((prompt) => <button key={prompt} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 hover:border-teal-200 hover:bg-teal-50">{prompt}</button>)}
      </div>
    </section>
  )
}
