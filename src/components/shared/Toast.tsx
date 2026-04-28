export function Toast({ message }: { message: string }) {
  if (!message) return null
  return <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-navy px-4 py-2 text-sm text-white shadow-soft">{message}</div>
}
