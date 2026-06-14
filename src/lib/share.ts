import type { GameState, MoveRecord } from '../types/game'
import { formatScoreShort, scoreVsPar } from './score'

type ShareState = Pick<
  GameState,
  'startWord' | 'targetWord' | 'turnsUsed' | 'par' | 'status' | 'moveHistory'
>

const GREEN = '🟩'
const RED = '🟥'

export function buildWordPath(
  startWord: string,
  moveHistory: MoveRecord[],
): string[] {
  if (moveHistory.length === 0) return [startWord]
  return [startWord, ...moveHistory.map((move) => move.word)]
}

export function buildShareGrid(words: string[], won: boolean): string {
  return words
    .map((word, index) => {
      const isLast = index === words.length - 1
      const square = won || !isLast ? GREEN : RED
      return square.repeat(word.length)
    })
    .join('\n')
}

export function buildShareText(
  gameState: ShareState,
  puzzleId: number,
  playUrl: string,
): string {
  const { startWord, targetWord, turnsUsed, par, status, moveHistory } =
    gameState
  const vsPar = scoreVsPar(turnsUsed, par)
  const score = formatScoreShort(vsPar)
  const won = status === 'won'
  const wordPath = buildWordPath(startWord, moveHistory)
  const grid = buildShareGrid(wordPath, won)

  const lines = [
    `Whittle #${puzzleId}`,
    `${startWord} → ${targetWord}`,
    won
      ? `${turnsUsed}/${par} · ${score}`
      : `${turnsUsed} moves · par ${par} · ${score}`,
    grid,
    playUrl,
  ]

  return lines.join('\n')
}

export function getPlayUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }
  return 'https://github.com/abbygp/whittle'
}

export async function copyShareText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export async function nativeShare(text: string): Promise<boolean> {
  if (!canNativeShare()) return false

  try {
    await navigator.share({ title: 'Whittle', text })
    return true
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return false
    return false
  }
}
