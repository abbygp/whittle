import { motion } from 'framer-motion'
import { useEffect } from 'react'
import type { GameStatus, MoveRecord } from '../types/game'
import type { PlayerStats } from '../lib/stats'
import { GameResultsPanel } from './GameResultsPanel'

interface GameModalProps {
  open: boolean
  status: GameStatus
  startWord: string
  targetWord: string
  turnsUsed: number
  par: number
  puzzleId: number
  moveHistory: MoveRecord[]
  stats: PlayerStats
  onClose: () => void
  onShareMessage?: (message: string) => void
}

export function GameModal({
  open,
  status,
  startWord,
  targetWord,
  turnsUsed,
  par,
  puzzleId,
  moveHistory,
  stats,
  onClose,
  onShareMessage,
}: GameModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (status === 'playing' || !open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative w-full max-w-sm overflow-hidden rounded-sm bg-wordle-bg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-wordle-border bg-black/[0.02] px-6 pb-4 pt-6">
          <div className="grid grid-cols-[2rem_1fr_2rem] items-center">
            <div aria-hidden />
            <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-wordle-gray">
              Whittle #{puzzleId}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-sm text-wordle-text transition hover:bg-black/5"
            >
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <GameResultsPanel
            status={status}
            startWord={startWord}
            targetWord={targetWord}
            turnsUsed={turnsUsed}
            par={par}
            puzzleId={puzzleId}
            moveHistory={moveHistory}
            stats={stats}
            onShareMessage={onShareMessage}
          />
        </div>
      </motion.div>
    </div>
  )
}
