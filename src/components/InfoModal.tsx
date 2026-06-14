import { motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import type { Level } from '../types/game'
import { HowToExample } from './HowToExample'
import { SolutionBoard } from './BoardPreview'
import { formatScore, scoreVsPar } from '../lib/score'
import { type PlayerStats, winRate } from '../lib/stats'
import { NextPuzzleCountdown } from './NextPuzzleCountdown'

export type InfoModalKind = 'stats' | 'how-to' | 'yesterday'

interface InfoModalProps {
  kind: InfoModalKind | null
  puzzle: Level
  yesterdayPuzzle: Level
  stats: PlayerStats
  turnsUsed: number
  par: number
  status: 'playing' | 'won' | 'lost'
  onClose: () => void
}

function ModalShell({
  title,
  onClose,
  children,
  compact = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  compact?: boolean
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-sm bg-wordle-bg shadow-xl ${
          compact ? 'max-h-[calc(100dvh-2rem)] overflow-y-auto p-4' : 'p-6'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`grid grid-cols-[2rem_1fr_2rem] items-center ${
            compact ? 'mb-2' : 'mb-4'
          }`}
        >
          <div aria-hidden />
          <h2
            className={`text-center font-bold tracking-wide text-wordle-text ${
              compact ? 'text-[20px]' : 'text-[24px]'
            }`}
          >
            {title}
          </h2>
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
        {children}
      </motion.div>
    </div>
  )
}

export function InfoModal({
  kind,
  puzzle,
  yesterdayPuzzle,
  stats,
  turnsUsed,
  par,
  status,
  onClose,
}: InfoModalProps) {
  if (!kind) return null

  if (kind === 'how-to') {
    return (
      <ModalShell title="How To Play" onClose={onClose}>
        <div className="space-y-3 text-left text-[15px] leading-relaxed text-wordle-text">
          <p>
            Reach the target word from the starting word by dropping or adding
            one letter per turn.
          </p>
          <p>Every intermediate word must be a valid English word.</p>
          <p>
            Use <span className="font-bold">Drop</span> to remove a letter and{' '}
            <span className="font-bold">Add</span> to insert one.
          </p>
          <HowToExample />
        </div>
      </ModalShell>
    )
  }

  if (kind === 'stats') {
    const vsPar = scoreVsPar(turnsUsed, par)

    return (
      <ModalShell title="Stats" onClose={onClose}>
        <div className="space-y-2 text-left text-[15px] text-wordle-text">
          {status === 'won' && (
            <div className="mb-3 border-b border-wordle-border pb-4 text-center leading-relaxed">
              <p className="mb-2 text-[24px] font-bold tracking-wide">Nice!</p>
              <p>
                <span className="font-bold tracking-widest">{puzzle.targetWord}</span>{' '}
                in <span className="font-bold">{turnsUsed}</span> moves.
              </p>
              <p>
                <span
                  className={
                    vsPar <= 0
                      ? 'font-bold text-wordle-green'
                      : 'font-bold text-wordle-gray'
                  }
                >
                  {formatScore(vsPar)}
                </span>
                <span className="text-wordle-gray"> (par {par})</span>
              </p>
              <p className="mt-1 text-[12px] text-wordle-gray">
                Whittle #{puzzle.id}
              </p>
            </div>
          )}
          <p>
            <span className="text-wordle-gray">Played:</span>{' '}
            <span className="font-bold">{stats.played}</span>
          </p>
          <p>
            <span className="text-wordle-gray">Win rate:</span>{' '}
            <span className="font-bold">{winRate(stats)}%</span>
          </p>
          <p>
            <span className="text-wordle-gray">Current streak:</span>{' '}
            <span className="font-bold">{stats.currentStreak}</span>
          </p>
          <p>
            <span className="text-wordle-gray">Max streak:</span>{' '}
            <span className="font-bold">{stats.maxStreak}</span>
          </p>
          {status === 'lost' && (
            <p className="pt-2 border-t border-wordle-border">
              <span className="text-wordle-gray">Whittle #{puzzle.id}:</span>{' '}
              <span className="font-bold">Lost</span>
              {turnsUsed > 0 && (
                <>
                  {' '}
                  · {turnsUsed} moves · {formatScore(vsPar)}
                </>
              )}
            </p>
          )}
          <NextPuzzleCountdown className="pt-3 border-t border-wordle-border" />
        </div>
      </ModalShell>
    )
  }

  return (
    <ModalShell title="Yesterday's Answer" onClose={onClose} compact>
      <div className="text-left text-wordle-text">
        <p className="mb-1.5 text-center text-[12px] text-wordle-gray">
          #{yesterdayPuzzle.id} · Par {yesterdayPuzzle.solutionPath.length - 1}
        </p>
        <SolutionBoard
          words={yesterdayPuzzle.solutionPath}
          targetWord={yesterdayPuzzle.targetWord}
          showGoal={false}
        />
      </div>
    </ModalShell>
  )
}
