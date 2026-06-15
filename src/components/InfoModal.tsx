import { motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import type { GameStatus, Level, MoveRecord } from '../types/game'
import { HowToExample } from './HowToExample'
import { SolutionBoard } from './BoardPreview'
import { GameResultsPanel } from './GameResultsPanel'
import { type PlayerStats } from '../lib/stats'

export type InfoModalKind = 'stats' | 'how-to' | 'yesterday'

interface InfoModalProps {
  kind: InfoModalKind | null
  puzzle: Level
  yesterdayPuzzle: Level
  stats: PlayerStats
  turnsUsed: number
  par: number
  status: GameStatus
  startWord: string
  targetWord: string
  moveHistory: MoveRecord[]
  onShareMessage?: (message: string) => void
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
  startWord,
  targetWord,
  moveHistory,
  onShareMessage,
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
    return (
      <ModalShell title="Stats" onClose={onClose} compact>
        <GameResultsPanel
          status={status}
          startWord={startWord}
          targetWord={targetWord}
          turnsUsed={turnsUsed}
          par={par}
          puzzleId={puzzle.id}
          moveHistory={moveHistory}
          stats={stats}
          onShareMessage={onShareMessage}
          lifetimeStats={
            <div className="space-y-2 border-y border-wordle-border py-4 text-left text-[15px] text-wordle-text">
              <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-wordle-gray">
                All time
              </p>
              <p>
                <span className="text-wordle-gray">Played:</span>{' '}
                <span className="font-bold">{stats.played}</span>
              </p>
              <p>
                <span className="text-wordle-gray">Wins:</span>{' '}
                <span className="font-bold">{stats.wins}</span>
              </p>
              <p>
                <span className="text-wordle-gray">Losses:</span>{' '}
                <span className="font-bold">{stats.losses}</span>
              </p>
              <p>
                <span className="text-wordle-gray">Max streak:</span>{' '}
                <span className="font-bold">{stats.maxStreak}</span>
              </p>
            </div>
          }
        />
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
