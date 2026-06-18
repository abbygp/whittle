export type GameMode = 'daily' | 'unlimited' | 'archive'

export function getGameModeFromLocation(): GameMode {
  if (typeof window === 'undefined') return 'daily'
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode')
  if (mode === 'unlimited') return 'unlimited'
  if (mode === 'archive') return 'archive'
  return 'daily'
}

export function getArchivePuzzleNumberFromLocation(): number | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  if (params.get('mode') !== 'archive') return null
  const puzzle = params.get('puzzle')
  if (!puzzle) return null
  const n = Number(puzzle)
  return Number.isInteger(n) && n > 0 ? n : null
}

export function isPremiumMode(mode: GameMode): boolean {
  return mode === 'unlimited' || mode === 'archive'
}

export function getArchivePuzzleUrl(puzzleNumber: number): string {
  return `?mode=archive&puzzle=${puzzleNumber}`
}

export function getModeUrl(mode: GameMode): string {
  if (mode === 'unlimited') return '?mode=unlimited'
  if (mode === 'archive') return '?mode=archive'
  const { pathname, search } = window.location
  const params = new URLSearchParams(search)
  params.delete('mode')
  params.delete('puzzle')
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname || '/'
}
