import type { Level } from '../types/game'

/** Par = steps in the curated solution path */
export function getPar(level: Level): number {
  return level.solutionPath.length - 1
}

/** Score relative to par: negative = under, positive = over, zero = even */
export function scoreVsPar(turnsUsed: number, par: number): number {
  return turnsUsed - par
}

export function formatScore(vsPar: number): string {
  if (vsPar === 0) return 'Even par'
  if (vsPar < 0) return `${Math.abs(vsPar)} under par`
  return `+${vsPar} over par`
}

export function formatScoreShort(vsPar: number): string {
  if (vsPar === 0) return '0'
  if (vsPar > 0) return `+${vsPar}`
  return `${vsPar}`
}
