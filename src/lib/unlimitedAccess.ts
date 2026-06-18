const UNLOCKED_KEY = 'whittle-unlimited-unlocked'

function normalizeCode(code: string): string {
  return code.trim().toUpperCase()
}

function getValidCodes(): string[] {
  const raw = import.meta.env.VITE_UNLIMITED_ACCESS_CODES ?? 'WHITTLESUMMER26'
  return raw
    .split(',')
    .map(normalizeCode)
    .filter(Boolean)
}

export function hasUnlimitedAccess(): boolean {
  try {
    return localStorage.getItem(UNLOCKED_KEY) === '1'
  } catch {
    return false
  }
}

export function unlockUnlimited(): void {
  try {
    localStorage.setItem(UNLOCKED_KEY, '1')
  } catch {
    // ignore storage errors
  }
}

export function tryUnlockWithCode(code: string): boolean {
  const normalized = normalizeCode(code)
  if (!normalized || !getValidCodes().includes(normalized)) return false

  unlockUnlimited()
  return true
}

export function checkUrlUnlock(): boolean {
  if (typeof window === 'undefined') return false

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code || !tryUnlockWithCode(code)) return false

  params.delete('code')
  const query = params.toString()
  const nextUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname || '/'
  window.history.replaceState({}, '', nextUrl)
  return true
}
