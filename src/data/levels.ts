import type { Level } from '../types/game'

export interface PuzzleDefinition {
  title: string
  startWord: string
  targetWord: string
  solutionPath: string[]
}

/** Curated puzzles — cycled daily at midnight America/New_York */
export const PUZZLES: PuzzleDefinition[] = [
  {
    title: 'Strange Range',
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
  },
  {
    title: 'Crate Plant',
    startWord: 'CRATE',
    targetWord: 'PLANT',
    solutionPath: ['CRATE', 'RATE', 'PRATE', 'PATE', 'PLATE', 'PLAT', 'PLANT'],
  },
  {
    title: 'Heart Spare',
    startWord: 'HEART',
    targetWord: 'SPARE',
    solutionPath: ['HEART', 'HEAR', 'SHEAR', 'SEAR', 'SPEAR', 'SPAR', 'SPARE'],
  },
  {
    title: 'Change Orange',
    startWord: 'CHANGE',
    targetWord: 'ORANGE',
    solutionPath: [
      'CHANGE',
      'HANGE',
      'HANGLE',
      'ANGLE',
      'RANGLE',
      'RANGE',
      'ORANGE',
    ],
  },
  {
    title: 'Castle Gather',
    startWord: 'CASTLE',
    targetWord: 'GATHER',
    solutionPath: [
      'CASTLE',
      'CASTE',
      'CASTER',
      'ASTER',
      'GASTER',
      'GATER',
      'GATHER',
    ],
  },
  {
    title: 'Master Walker',
    startWord: 'MASTER',
    targetWord: 'WALKER',
    solutionPath: [
      'MASTER',
      'ASTER',
      'WASTER',
      'WATER',
      'WAER',
      'WAKER',
      'WALKER',
    ],
  },
  {
    title: 'Single Winter',
    startWord: 'SINGLE',
    targetWord: 'WINTER',
    solutionPath: ['SINGLE', 'SINGE', 'SINE', 'SWINE', 'WINE', 'WINER', 'WINTER'],
  },
  {
    title: 'Silver Simple',
    startWord: 'SILVER',
    targetWord: 'SIMPLE',
    solutionPath: [
      'SILVER',
      'SIVER',
      'SIER',
      'SIPER',
      'SIMPER',
      'SIMPLER',
      'SIMPLE',
    ],
  },
  {
    title: 'Branch Orange',
    startWord: 'BRANCH',
    targetWord: 'ORANGE',
    solutionPath: [
      'BRANCH',
      'RANCH',
      'RANCHE',
      'RANCE',
      'RANE',
      'RANGE',
      'ORANGE',
    ],
  },
  {
    title: 'Spare Plant',
    startWord: 'SPARE',
    targetWord: 'PLANT',
    solutionPath: ['SPARE', 'SPAE', 'SPANE', 'PANE', 'PLANE', 'PLAN', 'PLANT'],
  },
  {
    title: 'Planet Plan',
    startWord: 'PLANET',
    targetWord: 'PLAN',
    solutionPath: ['PLANET', 'PLANE', 'PLAN'],
  },
  {
    title: 'Friend Find',
    startWord: 'FRIEND',
    targetWord: 'FIND',
    solutionPath: ['FRIEND', 'FIEND', 'FIND'],
  },
  {
    title: 'Plant Pant',
    startWord: 'PLANT',
    targetWord: 'PANT',
    solutionPath: ['PLANT', 'PLAN', 'PAN', 'PANT'],
  },
  {
    title: 'Tran Rang',
    startWord: 'TRAN',
    targetWord: 'RANG',
    solutionPath: ['TRAN', 'RAN', 'RANG'],
  },
  {
    title: 'Ghost Host',
    startWord: 'GHOST',
    targetWord: 'HOST',
    solutionPath: ['GHOST', 'HOST'],
  },
  {
    title: 'World Word',
    startWord: 'WORLD',
    targetWord: 'WORD',
    solutionPath: ['WORLD', 'WORD'],
  },
  {
    title: 'Bread Read',
    startWord: 'BREAD',
    targetWord: 'READ',
    solutionPath: ['BREAD', 'READ'],
  },
  {
    title: 'Flower Power',
    startWord: 'FLOWER',
    targetWord: 'POWER',
    solutionPath: ['FLOWER', 'POWER'],
  },
  {
    title: 'Winter Inter',
    startWord: 'WINTER',
    targetWord: 'INTER',
    solutionPath: ['WINTER', 'INTER'],
  },
  {
    title: 'Gather Castle',
    startWord: 'GATHER',
    targetWord: 'CASTLE',
    solutionPath: [
      'GATHER',
      'GATER',
      'GASTER',
      'ASTER',
      'CASTER',
      'CASTE',
      'CASTLE',
    ],
  },
]

export function buildPuzzleDescription(puzzle: PuzzleDefinition): string {
  const par = puzzle.solutionPath.length - 1
  return `Reach ${puzzle.targetWord} from ${puzzle.startWord}. Par is ${par} moves.`
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
