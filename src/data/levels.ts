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
  {
    title: 'Stream Dream',
    startWord: 'STREAM',
    targetWord: 'DREAM',
    solutionPath: ['STREAM', 'STRAM', 'TRAM', 'RAM', 'DRAM', 'DREAM'],
  },
  {
    title: 'Stream Street',
    startWord: 'STREAM',
    targetWord: 'STREET',
    solutionPath: [
      'STREAM',
      'STRAM',
      'STRA',
      'STRAE',
      'STRE',
      'STREE',
      'STREET',
    ],
  },
  {
    title: 'Spring String',
    startWord: 'SPRING',
    targetWord: 'STRING',
    solutionPath: ['SPRING', 'SPRIG', 'PRIG', 'RIG', 'TRIG', 'STRIG', 'STRING'],
  },
  {
    title: 'Spring Bring',
    startWord: 'SPRING',
    targetWord: 'BRING',
    solutionPath: ['SPRING', 'SPRIG', 'PRIG', 'RIG', 'BRIG', 'BRING'],
  },
  {
    title: 'Bright Light',
    startWord: 'BRIGHT',
    targetWord: 'LIGHT',
    solutionPath: ['BRIGHT', 'BIGHT', 'BLIGHT', 'LIGHT'],
  },
  {
    title: 'Money Honey',
    startWord: 'MONEY',
    targetWord: 'HONEY',
    solutionPath: ['MONEY', 'MONE', 'ONE', 'HONE', 'HONEY'],
  },
  {
    title: 'Mouse House',
    startWord: 'MOUSE',
    targetWord: 'HOUSE',
    solutionPath: ['MOUSE', 'MUSE', 'USE', 'HUSE', 'HOUSE'],
  },
  {
    title: 'Mouth South',
    startWord: 'MOUTH',
    targetWord: 'SOUTH',
    solutionPath: ['MOUTH', 'MOUT', 'OUT', 'TOUT', 'STOUT', 'STOUTH', 'SOUTH'],
  },
  {
    title: 'Water Later',
    startWord: 'WATER',
    targetWord: 'LATER',
    solutionPath: ['WATER', 'WASTER', 'ASTER', 'LASTER', 'LATER'],
  },
  {
    title: 'Place Plane',
    startWord: 'PLACE',
    targetWord: 'PLANE',
    solutionPath: ['PLACE', 'LACE', 'LANCE', 'LANE', 'PLANE'],
  },
  {
    title: 'Blade Trade',
    startWord: 'BLADE',
    targetWord: 'TRADE',
    solutionPath: ['BLADE', 'LADE', 'ADE', 'TADE', 'TRADE'],
  },
  {
    title: 'Clean Clear',
    startWord: 'CLEAN',
    targetWord: 'CLEAR',
    solutionPath: ['CLEAN', 'LEAN', 'LEA', 'LEAR', 'CLEAR'],
  },
  {
    title: 'Friend Trend',
    startWord: 'FRIEND',
    targetWord: 'TREND',
    solutionPath: ['FRIEND', 'FIEND', 'FEND', 'END', 'REND', 'TREND'],
  },
  {
    title: 'Walker Talker',
    startWord: 'WALKER',
    targetWord: 'TALKER',
    solutionPath: ['WALKER', 'WAKER', 'WAKE', 'AKE', 'TAKE', 'TAKER', 'TALKER'],
  },
  {
    title: 'Ghost Goat',
    startWord: 'GHOST',
    targetWord: 'GOAT',
    solutionPath: ['GHOST', 'HOST', 'HOAST', 'OAST', 'OAT', 'GOAT'],
  },
  {
    title: 'Winter Diner',
    startWord: 'WINTER',
    targetWord: 'DINER',
    solutionPath: ['WINTER', 'INTER', 'ITER', 'DITER', 'DIER', 'DINER'],
  },
  {
    title: 'Summer Hummer',
    startWord: 'SUMMER',
    targetWord: 'HUMMER',
    solutionPath: ['SUMMER', 'SCUMMER', 'CUMMER', 'CHUMMER', 'HUMMER'],
  },
  {
    title: 'Cloud Could',
    startWord: 'CLOUD',
    targetWord: 'COULD',
    solutionPath: ['CLOUD', 'CLOD', 'COD', 'COLD', 'COULD'],
  },
  {
    title: 'Grade Trade',
    startWord: 'GRADE',
    targetWord: 'TRADE',
    solutionPath: ['GRADE', 'GADE', 'ADE', 'TADE', 'TRADE'],
  },
  {
    title: 'Shiver Liver',
    startWord: 'SHIVER',
    targetWord: 'LIVER',
    solutionPath: ['SHIVER', 'SIVER', 'SLIVER', 'LIVER'],
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
