import type { GameState } from '../types/game'
import type { Level } from '../types/game'
import { createInitialState } from './gameLogic'

const STORAGE_KEY = 'whittle-daily-game'

export interface DailyGameSave {
  puzzleId: number
  gameState: GameState
  statsRecorded: boolean
}

export function loadDailyGame(puzzleId: number): DailyGameSave | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const saved = JSON.parse(raw) as DailyGameSave
    if (saved.puzzleId !== puzzleId) return null
    if (!saved.gameState || typeof saved.statsRecorded !== 'boolean') return null

    return saved
  } catch {
    return null
  }
}

export function saveDailyGame(save: DailyGameSave): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
  } catch {
    // ignore storage errors
  }
}

export function loadOrCreateDailyGame(level: Level): DailyGameSave {
  const saved = loadDailyGame(level.id)
  if (saved) return saved

  return {
    puzzleId: level.id,
    gameState: createInitialState(level),
    statsRecorded: false,
  }
}

export function isDailyGameFinished(save: DailyGameSave): boolean {
  return save.gameState.status !== 'playing'
}
