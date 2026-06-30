import type { Level } from '../types/game'
import { CURATED_PUZZLES } from './curatedPuzzles'
import { GENERATED_PUZZLES } from './generatedPuzzles'

export interface PuzzleDefinition {
  title: string
  startWord: string
  targetWord: string
  solutionPath: readonly string[]
}

/** Curated puzzles — cycled daily at midnight America/New_York */
export const MIN_PUZZLE_PAR = 3

export const PUZZLES: PuzzleDefinition[] = [
  ...CURATED_PUZZLES,
  ...GENERATED_PUZZLES,
]

export function buildPuzzleDescription(puzzle: PuzzleDefinition): string {
  const par = puzzle.solutionPath.length - 1
  return `Reach ${puzzle.targetWord} from ${puzzle.startWord}. Par is ${par} moves.`
}

function assertPuzzlePar(puzzle: PuzzleDefinition): void {
  const par = puzzle.solutionPath.length - 1
  if (par < MIN_PUZZLE_PAR) {
    throw new Error(
      `Puzzle "${puzzle.title}" has par ${par}; minimum is ${MIN_PUZZLE_PAR}.`,
    )
  }
}

if (PUZZLES.length < 365) {
  throw new Error(
    `Expected at least 365 daily puzzles, found ${PUZZLES.length}. Run scripts/generateYearPuzzles.mjs`,
  )
}

for (const puzzle of PUZZLES) {
  assertPuzzlePar(puzzle)
}

export function toLevel(puzzle: PuzzleDefinition, puzzleNumber: number): Level {
  return {
    id: puzzleNumber,
    title: puzzle.title,
    description: buildPuzzleDescription(puzzle),
    startWord: puzzle.startWord,
    targetWord: puzzle.targetWord,
    solutionPath: puzzle.solutionPath,
  }
}
