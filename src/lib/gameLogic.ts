import type { GameState, Level, MoveRecord, PlayerAction } from '../types/game'
import { getPar } from './score'
import { hasValidMoves } from './dictionary'

export function createInitialState(level: Level): GameState {
  return {
    currentWord: level.startWord,
    startWord: level.startWord,
    targetWord: level.targetWord,
    moveHistory: [],
    turnsUsed: 0,
    par: getPar(level),
    status: 'playing',
  }
}

export function deleteLetterAt(word: string, index: number): string {
  return word.slice(0, index) + word.slice(index + 1)
}

export function insertLetterAt(word: string, index: number, letter: string): string {
  return word.slice(0, index) + letter + word.slice(index)
}

export function applyAction(
  state: GameState,
  action: PlayerAction,
  dictionary: Set<string>,
): { next: GameState; invalid: boolean } {
  if (state.status !== 'playing') {
    return { next: state, invalid: false }
  }

  let nextWord: string
  let move: MoveRecord

  if (action.type === 'delete') {
    const removedLetter = state.currentWord[action.index]
    if (!removedLetter) return { next: state, invalid: true }

    nextWord = deleteLetterAt(state.currentWord, action.index).toUpperCase()
    if (!dictionary.has(nextWord.toLowerCase())) {
      return { next: state, invalid: true }
    }

    move = {
      word: nextWord,
      type: 'delete',
      index: action.index,
      letter: removedLetter,
    }
  } else {
    const letter = action.letter.toUpperCase()
    if (!/^[A-Z]$/.test(letter)) return { next: state, invalid: true }

    nextWord = insertLetterAt(state.currentWord, action.index, letter).toUpperCase()
    if (!dictionary.has(nextWord.toLowerCase())) {
      return { next: state, invalid: true }
    }

    move = {
      word: nextWord,
      type: 'insert',
      index: action.index,
      letter,
    }
  }

  const turnsUsed = state.turnsUsed + 1
  const moveHistory = [...state.moveHistory, move]
  const status: GameState['status'] =
    nextWord === state.targetWord ? 'won' : 'playing'

  return {
    next: {
      ...state,
      currentWord: nextWord,
      moveHistory,
      turnsUsed,
      status,
    },
    invalid: false,
  }
}

export function checkDeadEndLoss(
  state: GameState,
  dictionary: Set<string>,
): GameState {
  if (state.status !== 'playing') return state
  if (state.currentWord === state.targetWord) return state

  if (!hasValidMoves(state.currentWord, dictionary)) {
    return { ...state, status: 'lost' }
  }

  return state
}
