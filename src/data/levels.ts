import type { Level } from '../types/game'

/** The one puzzle — six moves, mixed drops and adds, many dead ends */
export const PUZZLE: Level = {
  id: 1,
  title: 'Strange Range',
  description: 'Reach RANGE from STRANGE. Par is 6 moves — beat it if you can.',
  startWord: 'STRANGE',
  targetWord: 'RANGE',
  solutionPath: [
    'STRANGE',
    'STRANG',
    'STRAG',
    'TRAG',
    'RAG',
    'RANG',
    'RANGE',
  ],
}
