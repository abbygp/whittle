export type MoveType = 'delete' | 'insert'

export interface MoveRecord {
  word: string
  type: MoveType
  index: number
  letter: string
}

export interface Level {
  id: number
  title: string
  description: string
  startWord: string
  targetWord: string
  solutionPath: string[]
}

export type GameStatus = 'playing' | 'won' | 'lost'

export type PlayerAction =
  | { type: 'delete'; index: number }
  | { type: 'insert'; index: number; letter: string }

export interface GameState {
  currentWord: string
  startWord: string
  targetWord: string
  moveHistory: MoveRecord[]
  turnsUsed: number
  /** Target move count — finishing above/below this is the score */
  par: number
  status: GameStatus
}
