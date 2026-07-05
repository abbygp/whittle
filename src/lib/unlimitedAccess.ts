const UNLIMITED_ACTIVE_KEY = 'whittle_unlimited_active'
const LEGACY_UNLOCKED_KEY = 'whittle-unlimited-unlocked'

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

  return { unlocked: hasUnlimitedAccess(), fromStripe: false }
}
