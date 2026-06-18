import { motion } from 'framer-motion'
import { useEffect } from 'react'
import type { Level } from '../types/game'
import { SolutionBoard } from './BoardPreview'

interface AnswerModalProps {
  open: boolean
  puzzle: Level
  onClose: () => void
  onNextPuzzle?: () => void
}

export function AnswerModal({
  open,
  puzzle,
  onClose,
  onNextPuzzle,
}: AnswerModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-sm bg-wordle-bg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-wordle-border bg-black/[0.02] px-6 pb-4 pt-6">
          <div className="grid grid-cols-[2rem_1fr_2rem] items-center">
            <div aria-hidden />
            <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-wordle-gray">
              Answer · Unlimited #{puzzle.id}
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

        <div className="space-y-4 px-6 py-5">
          <p className="text-center text-[14px] text-wordle-text">
            <span className="font-bold tracking-widest">{puzzle.startWord}</span>
            {' → '}
            <span className="font-bold tracking-widest">{puzzle.targetWord}</span>
            {' · Par '}
            {puzzle.solutionPath.length - 1}
          </p>

          <SolutionBoard
            words={puzzle.solutionPath}
            targetWord={puzzle.targetWord}
            showGoal={false}
          />

          {onNextPuzzle && (
            <button
              type="button"
              onClick={onNextPuzzle}
              className="flex h-12 w-full items-center justify-center bg-wordle-green text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Next Puzzle
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
