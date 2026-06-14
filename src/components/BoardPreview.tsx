type TileSize = 'md' | 'sm' | 'xs'

function tileSizeForWordLength(length: number): TileSize {
  if (length >= 7) return 'xs'
  if (length >= 5) return 'sm'
  return 'md'
}

function tileClasses(size: TileSize) {
  switch (size) {
    case 'xs':
      return {
        tile: 'h-8 w-8 text-[14px]',
        gap: 'gap-[2px]',
        goal: 'h-7 w-7 text-[11px]',
      }
    case 'sm':
      return {
        tile: 'h-8 w-8 text-[15px]',
        gap: 'gap-[2px]',
        goal: 'h-7 w-7 text-[11px]',
      }
    default:
      return {
        tile: 'h-9 w-9 text-[18px] sm:h-10 sm:w-10 sm:text-[20px]',
        gap: 'gap-[3px]',
        goal: 'h-7 w-7 text-[10px] sm:h-8 sm:w-8',
      }
  }
}

function boardTileSize(words: readonly string[], targetWord: string): TileSize {
  const maxLen = Math.max(
    ...words.map((word) => word.length),
    targetWord.length,
  )
  const sizeFromLength = tileSizeForWordLength(maxLen)
  if (words.length >= 6 && sizeFromLength === 'md') return 'sm'
  return sizeFromLength
}

export function getMoveLabel(from: string, to: string): string {
  if (to.length === from.length - 1) {
    for (let i = 0; i < from.length; i += 1) {
      if (from.slice(0, i) + from.slice(i + 1) === to) {
        return `Drop ${from[i]}`
      }
    }
  }

  if (to.length === from.length + 1) {
    for (let i = 0; i <= from.length; i += 1) {
      if (to.slice(0, i) + to.slice(i + 1) === from) {
        return `Add ${to[i]}`
      }
    }
  }

  return 'Move'
}

export function PreviewTileRow({
  word,
  variant,
  size = 'md',
}: {
  word: string
  variant: 'green' | 'active'
  size?: TileSize
}) {
  const { tile, gap } = tileClasses(size)
  const styles =
    variant === 'green'
      ? 'bg-wordle-green border-wordle-green text-white'
      : 'border-wordle-border bg-wordle-tile-active text-wordle-text'

  return (
    <div className={`flex justify-center ${gap}`} aria-label={word}>
      {word.split('').map((letter, index) => (
        <div
          key={`${word}-${index}`}
          className={`flex items-center justify-center border-2 font-bold uppercase ${tile} ${styles}`}
        >
          {letter}
        </div>
      ))}
    </div>
  )
}

export function PreviewMoveHint({ label }: { label: string }) {
  return (
    <p
      className={`text-center text-[9px] font-semibold uppercase leading-none tracking-widest text-wordle-gray`}
    >
      {label}
    </p>
  )
}

export function PreviewGoalRow({
  word,
  size = 'md',
}: {
  word: string
  size?: TileSize
}) {
  const { gap, goal } = tileClasses(size)

  return (
    <div className="mt-2 flex items-center justify-center gap-1.5">
      <span className="text-[8px] font-semibold uppercase tracking-widest text-wordle-gray">
        Goal
      </span>
      <div className={`flex ${gap}`}>
        {word.split('').map((letter, index) => (
          <div
            key={`goal-${index}`}
            className={`flex items-center justify-center border-2 border-dashed border-wordle-border font-bold uppercase text-wordle-gray ${goal}`}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  )
}

export function PreviewModeToggle({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`mx-auto flex w-fit rounded-sm border border-wordle-border p-0.5 ${
        compact ? 'mt-2' : 'mt-3'
      }`}
    >
      <div
        className={`rounded-sm bg-wordle-text font-bold uppercase tracking-wide text-white ${
          compact ? 'px-2 py-0.5 text-[8px]' : 'px-2.5 py-1 text-[9px]'
        }`}
      >
        Drop
      </div>
      <div
        className={`rounded-sm font-bold uppercase tracking-wide text-wordle-gray ${
          compact ? 'px-2 py-0.5 text-[8px]' : 'px-2.5 py-1 text-[9px]'
        }`}
      >
        Add
      </div>
    </div>
  )
}

interface SolutionBoardProps {
  words: readonly string[]
  targetWord: string
  showMoveHints?: boolean
  showModeToggle?: boolean
  showGoal?: boolean
}

export function SolutionBoard({
  words,
  targetWord,
  showMoveHints = true,
  showModeToggle = false,
  showGoal,
}: SolutionBoardProps) {
  const finished = words[words.length - 1] === targetWord
  const tileSize = boardTileSize(words, targetWord)
  const compact = tileSize !== 'md'
  const shouldShowGoal = showGoal ?? !finished

  return (
    <div
      className={`rounded-sm border border-wordle-border bg-wordle-bg ${
        compact ? 'px-1.5 py-2' : 'px-2 py-3'
      }`}
    >
      <div className="flex flex-col items-center gap-[2px]">
        <PreviewTileRow word={words[0]} variant="green" size={tileSize} />
        {words.slice(1).map((word, index) => {
          const previous = words[index]
          const isCurrent = !finished && index === words.length - 2

          return (
            <div
              key={`${word}-${index}`}
              className="flex w-full flex-col items-center gap-[2px]"
            >
              {showMoveHints && (
                <PreviewMoveHint label={getMoveLabel(previous, word)} />
              )}
              <PreviewTileRow
                word={word}
                variant={isCurrent ? 'active' : 'green'}
                size={tileSize}
              />
            </div>
          )
        })}
      </div>
      {showModeToggle && <PreviewModeToggle compact={compact} />}
      {shouldShowGoal && (
        <PreviewGoalRow word={targetWord} size={tileSize} />
      )}
    </div>
  )
}
