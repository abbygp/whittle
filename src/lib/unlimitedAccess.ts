const UNLIMITED_ACTIVE_KEY = 'whittle_unlimited_active'
const LEGACY_UNLOCKED_KEY = 'whittle-unlimited-unlocked'

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

function migrateLegacyUnlock(): boolean {
  try {
    if (localStorage.getItem(LEGACY_UNLOCKED_KEY) !== '1') return false
    localStorage.setItem(UNLIMITED_ACTIVE_KEY, 'true')
    localStorage.removeItem(LEGACY_UNLOCKED_KEY)
    return true
  } catch {
    return false
  }
}

export function hasUnlimitedAccess(): boolean {
  try {
    if (localStorage.getItem(UNLIMITED_ACTIVE_KEY) === 'true') return true
    return migrateLegacyUnlock()
  } catch {
    return false
  }
}

export function unlockUnlimited(): void {
  try {
    localStorage.setItem(UNLIMITED_ACTIVE_KEY, 'true')
    localStorage.removeItem(LEGACY_UNLOCKED_KEY)
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
  window.history.replaceState({}, document.title, nextUrl)
  return true
}

function cleanUrlSearchParams(params: URLSearchParams): void {
  const query = params.toString()
  const nextUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname || '/'
  window.history.replaceState({}, document.title, nextUrl)
}

/** Unlocks Unlimited and Archive from a Stripe checkout redirect. */
export function checkStripeSessionUnlock(): boolean {
  if (typeof window === 'undefined') return false

  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('session_id')
  if (!sessionId?.startsWith('cs_')) return false

  unlockUnlimited()
  params.delete('session_id')
  cleanUrlSearchParams(params)
  return true
}

export function resolvePremiumUnlockFromUrl(): {
  unlocked: boolean
  fromStripe: boolean
} {
  if (checkStripeSessionUnlock()) {
    return { unlocked: true, fromStripe: true }
  }

  if (checkUrlUnlock()) {
    return { unlocked: true, fromStripe: false }
  }

  return { unlocked: hasUnlimitedAccess(), fromStripe: false }
}
