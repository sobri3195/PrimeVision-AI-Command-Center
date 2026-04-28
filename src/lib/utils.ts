export const clamp = (v: number, min = 0, max = 100) => Math.min(max, Math.max(min, v))
export const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]
export const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n)
