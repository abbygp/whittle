import type { GameStatus } from '../types/game'

export interface PlayerStats {
  played: number
  wins: number
  losses: number
  currentStreak: number
  maxStreak: number
}

const STORAGE_KEY = 'whittle-stats'
const RECORDED_PUZZLES_KEY = 'whittle-recorded-puzzles'

const DEFAULT_STATS: PlayerStats = {
  played: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  maxStreak: 0,
}

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATS }
    return { ...DEFAULT_STATS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_STATS }
  }
}

export function saveStats(stats: PlayerStats): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

function loadRecordedPuzzleIds(): Set<number> {
  try {
    const raw = localStorage.getItem(RECORDED_PUZZLES_KEY)
    if (!raw) return new Set()
    const ids = JSON.parse(raw) as number[]
    return new Set(ids)
  } catch {
    return new Set()
  }
}

function saveRecordedPuzzleIds(ids: Set<number>): void {
  localStorage.setItem(RECORDED_PUZZLES_KEY, JSON.stringify([...ids]))
}

export function hasRecordedResult(puzzleId: number): boolean {
  return loadRecordedPuzzleIds().has(puzzleId)
}

export function recordResult(
  status: Exclude<GameStatus, 'playing'>,
  puzzleId: number,
): PlayerStats {
  const stats = loadStats()
  const recorded = loadRecordedPuzzleIds()

  if (recorded.has(puzzleId)) {
    return stats
  }

  stats.played += 1

  if (status === 'won') {
    stats.wins += 1
    stats.currentStreak += 1
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
  } else {
    stats.losses += 1
    stats.currentStreak = 0
  }

  recorded.add(puzzleId)
  saveRecordedPuzzleIds(recorded)
  saveStats(stats)
  return stats
}

export function winRate(stats: PlayerStats): number {
  if (stats.played === 0) return 0
  return Math.round((stats.wins / stats.played) * 100)
}
