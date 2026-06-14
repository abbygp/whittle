import { motion } from 'framer-motion'
import type { GameStatus } from '../types/game'
import { formatScore, scoreVsPar } from '../lib/score'

interface GameModalProps {
  status: GameStatus
  targetWord: string
  turnsUsed: number
  par: number
}

export function GameModal({
  status,
  targetWord,
  turnsUsed,
  par,
}: GameModalProps) {
  if (status === 'playing') return null

  const won = status === 'won'
  const vsPar = scoreVsPar(turnsUsed, par)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-wordle-bg p-6 text-center shadow-xl"
      >
        <h2 className="text-[32px] font-bold tracking-wide text-wordle-text">
          {won ? 'Nice!' : 'Game over'}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-wordle-text">
          {won ? (
            <>
              <span className="font-bold tracking-widest">{targetWord}</span> in{' '}
              <span className="font-bold">{turnsUsed}</span> moves.
              <br />
              <span
                className={
                  vsPar <= 0 ? 'text-wordle-green' : 'text-wordle-gray'
                }
              >
                {formatScore(vsPar)}
              </span>
              <span className="text-wordle-gray"> (par {par})</span>
            </>
          ) : (
            <>
              Stuck before reaching{' '}
              <span className="font-bold tracking-widest">{targetWord}</span>.
              <br />
              <span className="text-wordle-gray">
                {turnsUsed} moves played · par {par}
                {turnsUsed > 0 && <> · {formatScore(vsPar)}</>}
              </span>
            </>
          )}
        </p>
      </motion.div>
    </div>
  )
}
