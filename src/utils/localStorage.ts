export type StoredValue<T> = {
  value: T
  updatedAt: number
  expiresAt?: number
}

export function saveLS<T>(key: string, value: T, ttlMs?: number) {
  const payload: StoredValue<T> = {
    value,
    updatedAt: Date.now(),
    expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
  }
  localStorage.setItem(key, JSON.stringify(payload))
}

export function loadLS<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as T | StoredValue<T>
    const isWrapped = typeof parsed === 'object' && parsed !== null && 'value' in parsed
    const next = (isWrapped ? (parsed as StoredValue<T>).value : parsed) as unknown

    if (isWrapped && (parsed as StoredValue<T>).expiresAt && Date.now() > ((parsed as StoredValue<T>).expiresAt as number)) {
      localStorage.removeItem(key)
      return fallback
    }

    if (validate && !validate(next)) {
      console.warn(`Invalid localStorage schema for key: ${key}`)
      return fallback
    }

    return next as T
  } catch (error) {
    console.warn(`Failed to parse localStorage key: ${key}`, error)
    return fallback
  }
}

export function removeLS(key: string) {
  localStorage.removeItem(key)
}
