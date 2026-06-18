import { PUZZLES, toLevel, type PuzzleDefinition } from '../data/levels'
import type { Level } from '../types/game'

/** First daily puzzle date in Eastern Time (inclusive) */
export const PUZZLE_ANCHOR_KEY = '2026-06-14'

export const PUZZLE_TIMEZONE = 'America/New_York'

export function getESTDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PUZZLE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function daysSinceAnchor(date = new Date()): number {
  const todayKey = getESTDateKey(date)
  const [anchorYear, anchorMonth, anchorDay] = PUZZLE_ANCHOR_KEY.split('-').map(
    Number,
  )
  const [year, month, day] = todayKey.split('-').map(Number)
  const anchorUtc = Date.UTC(anchorYear, anchorMonth - 1, anchorDay)
  const todayUtc = Date.UTC(year, month - 1, day)
  return Math.round((todayUtc - anchorUtc) / 86400000)
}

function puzzleIndexForDayOffset(dayOffset: number): number {
  return ((dayOffset % PUZZLES.length) + PUZZLES.length) % PUZZLES.length
}

function puzzleForDayOffset(dayOffset: number): Level {
  const definition = PUZZLES[puzzleIndexForDayOffset(dayOffset)]
  return toLevel(definition, dayOffset + 1)
}

export function getArchivePuzzleCount(date = new Date()): number {
  return Math.max(0, daysSinceAnchor(date))
}

export function getArchivePuzzle(
  puzzleNumber: number,
  date = new Date(),
): Level | null {
  const dayOffset = puzzleNumber - 1
  if (dayOffset < 0 || dayOffset >= daysSinceAnchor(date)) return null
  return puzzleForDayOffset(dayOffset)
}

export function getArchivePuzzles(date = new Date()): Level[] {
  const count = getArchivePuzzleCount(date)
  return Array.from({ length: count }, (_, dayOffset) =>
    puzzleForDayOffset(dayOffset),
  )
}

export function getDateLabelForPuzzleNumber(puzzleNumber: number): string {
  const dayOffset = puzzleNumber - 1
  const [year, month, day] = PUZZLE_ANCHOR_KEY.split('-').map(Number)
  const utc = Date.UTC(year, month - 1, day + dayOffset, 12, 0, 0)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: PUZZLE_TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(utc))
}

export function getDailyPuzzle(date = new Date()): Level {
  return puzzleForDayOffset(daysSinceAnchor(date))
}

export function getYesterdayPuzzle(date = new Date()): Level {
  return puzzleForDayOffset(daysSinceAnchor(date) - 1)
}

export function getPuzzleNumber(date = new Date()): number {
  return daysSinceAnchor(date) + 1
}

export function msUntilNextPuzzle(date = new Date()): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: PUZZLE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)

  const hour = get('hour') % 24
  const minute = get('minute')
  const second = get('second')

  const elapsedMs = ((hour * 60 + minute) * 60 + second) * 1000
  const dayMs = 24 * 60 * 60 * 1000

  return dayMs - elapsedMs
}

export function getPuzzleDefinition(dayOffset: number): PuzzleDefinition {
  return PUZZLES[puzzleIndexForDayOffset(dayOffset)]
}
