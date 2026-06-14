import type { GameState } from '../types/game'
import { formatScoreShort, scoreVsPar } from '../lib/score'

interface GameHeaderProps {
  gameState: GameState
}

export function GameHeader({ gameState }: GameHeaderProps) {
  const { turnsUsed, par, status } = gameState
  const vsPar = scoreVsPar(turnsUsed, par)
  const scoreLabel =
    status === 'playing' && turnsUsed > 0
      ? formatScoreShort(vsPar)
      : null

  return (
    <header className="sticky top-0 z-20 border-b border-wordle-border bg-wordle-bg px-2 pb-1 pt-2 sm:px-4">
      <div className="mx-auto flex max-w-lg items-center justify-center pt-1">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[28px] font-bold leading-none tracking-[0.2em] sm:text-[36px]">
            WHITTLE
          </h1>
          <p className="text-[10px] font-semibold uppercase leading-none tracking-widest text-wordle-gray">
            {turnsUsed} moves · par {par}
            {scoreLabel !== null && (
              <span
                className={
                  vsPar <= 0 ? ' text-wordle-green' : ' text-wordle-gray'
                }
              >
                {' '}
                · {scoreLabel}
              </span>
            )}
          </p>
        </div>
      </div>
    </header>
  )
}
