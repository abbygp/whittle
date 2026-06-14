const HOW_TO_SEEN_KEY = 'whittle-how-to-seen'

export function hasSeenHowToPlay(): boolean {
  try {
    return localStorage.getItem(HOW_TO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markHowToPlaySeen(): void {
  try {
    localStorage.setItem(HOW_TO_SEEN_KEY, '1')
  } catch {
    // ignore storage errors
  }
}
