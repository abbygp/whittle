import { motion } from 'framer-motion'
import type { GameState } from '../types/game'

const TILE =
  'flex h-[58px] w-[58px] items-center justify-center border-2 text-[32px] font-bold uppercase sm:h-[62px] sm:w-[62px]'

const GAP =
  'flex h-[58px] w-[14px] items-center justify-center sm:h-[62px] sm:w-[16px]'

type EditMode = 'drop' | 'add'

interface ActiveWordRowProps {
  word: string
  shake: boolean
  disabled: boolean
  mode: EditMode
  selectedGap: number | null
  onDrop: (index: number) => void
  onSelectGap: (index: number) => void
}

function ActiveWordRow({
  word,
  shake,
  disabled,
  mode,
  selectedGap,
  onDrop,
  onSelectGap,
}: ActiveWordRowProps) {
  const letters = word.split('')

  return (
    <div
      className={`flex items-center justify-center ${shake ? 'animate-shake' : ''}`}
      aria-label={`Current word: ${word}`}
    >
      {letters.map((letter, index) => (
        <div key={`${word}-${index}`} className="flex items-center">
          {mode === 'add' && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelectGap(index)}
              className={[
                GAP,
                'rounded-sm text-lg font-bold transition',
                selectedGap === index
                  ? 'bg-wordle-green/20 text-wordle-green'
                  : 'text-wordle-gray hover:bg-black/5',
                disabled ? 'cursor-default opacity-50' : 'cursor-pointer',
              ].join(' ')}
              aria-label={`Insert before ${letter}`}
            >
              +
            </button>
          )}

          <motion.button
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            whileTap={disabled || mode !== 'drop' ? undefined : { scale: 0.95 }}
            type="button"
            disabled={disabled || mode !== 'drop'}
            onClick={() => onDrop(index)}
            className={[
              TILE,
              mode === 'drop'
                ? 'cursor-pointer border-wordle-border bg-wordle-tile-active text-wordle-text hover:border-[#878a8c] hover:bg-[#f6f7f8]'
                : 'border-wordle-border bg-wordle-tile-active text-wordle-text opacity-90',
              'focus-visible:outline-none focus-visible:border-wordle-text',
              disabled ? 'cursor-default opacity-80' : '',
            ].join(' ')}
            aria-label={`Drop letter ${letter}`}
          >
            {letter}
          </motion.button>
        </div>
      ))}

      {mode === 'add' && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectGap(letters.length)}
          className={[
            GAP,
            'rounded-sm text-lg font-bold transition',
            selectedGap === letters.length
              ? 'bg-wordle-green/20 text-wordle-green'
              : 'text-wordle-gray hover:bg-black/5',
            disabled ? 'cursor-default opacity-50' : 'cursor-pointer',
          ].join(' ')}
          aria-label="Insert at end"
        >
          +
        </button>
      )}
    </div>
  )
}

function LockedRow({
  word,
  variant,
}: {
  word: string
  variant: 'green' | 'gray'
}) {
  const bg =
    variant === 'green'
      ? 'bg-wordle-green border-wordle-green'
      : 'bg-wordle-gray border-wordle-gray'

  return (
    <div className="flex justify-center gap-[5px]" aria-label={word}>
      {word.split('').map((letter, index) => (
        <div key={`${word}-${index}`} className={`${TILE} ${bg} text-white`}>
          {letter}
        </div>
      ))}
    </div>
  )
}

type BoardRow =
  | { kind: 'locked'; word: string; variant: 'green' | 'gray' }
  | { kind: 'active'; word: string }

function buildRows(gameState: GameState): BoardRow[] {
  const { startWord, currentWord, turnsUsed, moveHistory, status } = gameState
  const rows: BoardRow[] = []

  if (turnsUsed > 0) {
    rows.push({ kind: 'locked', word: startWord, variant: 'green' })
    for (let i = 0; i < turnsUsed - 1; i += 1) {
      rows.push({
        kind: 'locked',
        word: moveHistory[i]?.word ?? '',
        variant: 'green',
      })
    }
  }

  if (status === 'playing') {
    rows.push({ kind: 'active', word: currentWord })
  } else {
    rows.push({
      kind: 'locked',
      word: currentWord,
      variant: status === 'won' ? 'green' : 'gray',
    })
  }

  return rows
}

interface WordleBoardProps {
  gameState: GameState
  shake: boolean
  disabled: boolean
  mode: EditMode
  selectedGap: number | null
  onModeChange: (mode: EditMode) => void
  onDrop: (index: number) => void
  onSelectGap: (index: number) => void
}

export function WordleBoard({
  gameState,
  shake,
  disabled,
  mode,
  selectedGap,
  onModeChange,
  onDrop,
  onSelectGap,
}: WordleBoardProps) {
  const { targetWord, turnsUsed } = gameState
  const rows = buildRows(gameState)

  return (
    <div className="flex w-full flex-col items-center gap-[5px]">
      {rows.map((row, i) => {
        if (row.kind === 'locked') {
          return (
            <LockedRow
              key={`locked-${i}-${row.word}`}
              word={row.word}
              variant={row.variant}
            />
          )
        }
        return (
          <ActiveWordRow
            key={`active-${row.word}-${turnsUsed}`}
            word={row.word}
            shake={shake}
            disabled={disabled}
            mode={mode}
            selectedGap={selectedGap}
            onDrop={onDrop}
            onSelectGap={onSelectGap}
          />
        )
      })}

      {!disabled && (
        <div className="mt-4 flex rounded-sm border border-wordle-border p-0.5">
          <button
            type="button"
            onClick={() => onModeChange('drop')}
            className={[
              'rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wide transition',
              mode === 'drop'
                ? 'bg-wordle-text text-white'
                : 'text-wordle-gray hover:bg-black/5',
            ].join(' ')}
          >
            Drop
          </button>
          <button
            type="button"
            onClick={() => onModeChange('add')}
            className={[
              'rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wide transition',
              mode === 'add'
                ? 'bg-wordle-text text-white'
                : 'text-wordle-gray hover:bg-black/5',
            ].join(' ')}
          >
            Add
          </button>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-wordle-gray">
          Goal
        </span>
        <div className="flex gap-[4px]">
          {targetWord.split('').map((letter, i) => (
            <div
              key={`goal-${i}`}
              className="flex h-9 w-9 items-center justify-center border-2 border-dashed border-wordle-border text-sm font-bold uppercase text-wordle-gray"
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export type { EditMode }
