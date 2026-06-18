import { PUZZLES, toLevel } from '../data/levels'
import type { Level } from '../types/game'
import { createInitialState } from './gameLogic'

function puzzleAtIndex(index: number): Level {
  return toLevel(PUZZLES[index], index + 1)
}

export function getRandomUnlimitedPuzzle(excludeId?: number): Level {
  if (PUZZLES.length === 0) {
    throw new Error('No puzzles available')
  }

  if (PUZZLES.length === 1) {
    return puzzleAtIndex(0)
  }

  let index = Math.floor(Math.random() * PUZZLES.length)
  let attempts = 0

  while (excludeId !== undefined && puzzleAtIndex(index).id === excludeId) {
    index = Math.floor(Math.random() * PUZZLES.length)
    attempts += 1
    if (attempts > PUZZLES.length * 2) break
  }

  return puzzleAtIndex(index)
}

export function createUnlimitedSession(excludeId?: number) {
  const puzzle = getRandomUnlimitedPuzzle(excludeId)
  return {
    puzzle,
    gameState: createInitialState(puzzle),
  }
}
