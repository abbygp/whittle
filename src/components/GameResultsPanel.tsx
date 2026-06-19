import { useMemo, useState, type ReactNode } from 'react'
import type { GameStatus, MoveRecord } from '../types/game'
import {
  buildShareText,
  canNativeShare,
  copyShareText,
  getPlayUrl,
  nativeShare,
} from '../lib/share'
import { formatScore, scoreVsPar } from '../lib/score'
import { COFFEE_URL } from '../lib/support'
import type { GameMode } from '../lib/gameMode'
import { getModeUrl } from '../lib/gameMode'
import { type PlayerStats, winRate } from '../lib/stats'
import { NextPuzzleCountdown } from './NextPuzzleCountdown'

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-sm border border-wordle-border bg-black/[0.02] px-2 py-3">
      <span className="text-[22px] font-bold leading-none text-wordle-text">
        {value}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-wordle-gray">
        {label}
      </span>
    </div>
  )
}

interface GameResultsPanelProps {
  status: GameStatus
  startWord: string
  targetWord: string
  turnsUsed: number
  par: number
  puzzleId: number
  moveHistory: MoveRecord[]
  stats: PlayerStats
  gameMode?: GameMode
  onShareMessage?: (message: string) => void
  onNextPuzzle?: () => void
  lifetimeStats?: ReactNode
}

export function GameResultsPanel({
  status,
  startWord,
  targetWord,
  turnsUsed,
  par,
  puzzleId,
  moveHistory,
  stats,
  gameMode = 'daily',
  onShareMessage,
  onNextPuzzle,
  lifetimeStats,
}: GameResultsPanelProps) {
  const isUnlimited = gameMode === 'unlimited'
  const [copied, setCopied] = useState(false)
  const finished = status !== 'playing'
  const won = status === 'won'
  const vsPar = scoreVsPar(turnsUsed, par)

  const shareText = useMemo(
    () =>
      buildShareText(
        { startWord, targetWord, turnsUsed, par, status, moveHistory },
        puzzleId,
        getPlayUrl(isUnlimited),
        isUnlimited,
      ),
    [
      startWord,
      targetWord,
      turnsUsed,
      par,
      status,
      moveHistory,
      puzzleId,
      isUnlimited,
    ],
  )
  const showNativeShare = canNativeShare()

  const handleCopy = async () => {
    const success = await copyShareText(shareText)
    if (success) {
      setCopied(true)
      onShareMessage?.('Copied to clipboard')
      window.setTimeout(() => setCopied(false), 2000)
      return
    }
    onShareMessage?.('Could not copy')
  }

  const handleShare = async () => {
    const success = await nativeShare(shareText)
    if (success) onShareMessage?.('Shared')
  }

  return (
    <div className="space-y-4">
      {finished && (
        <div className="text-center leading-relaxed">
          <p className="mb-2 text-[24px] font-bold tracking-wide text-wordle-text">
            {won ? 'Nice!' : 'Game over'}
          </p>
          <p className="text-[14px] text-wordle-text">
            {won ? (
              <>
                <span className="font-bold tracking-widest">{targetWord}</span> in{' '}
                <span className="font-bold">{turnsUsed}</span> moves ·{' '}
                <span
                  className={
                    vsPar <= 0 ? 'font-bold text-wordle-green' : 'text-wordle-gray'
                  }
                >
                  {formatScore(vsPar)}
                </span>
              </>
            ) : (
              <>
                Stuck before{' '}
                <span className="font-bold tracking-widest">{targetWord}</span>
                {turnsUsed > 0 && (
                  <>
                    {' '}
                    · <span className="text-wordle-gray">{formatScore(vsPar)}</span>
                  </>
                )}
              </>
            )}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <StatCard label="Streak" value={String(stats.currentStreak)} />
        <StatCard label="Win %" value={`${winRate(stats)}%`} />
        <StatCard label="Moves" value={String(turnsUsed)} />
      </div>

      {lifetimeStats}

      {isUnlimited ? (
        onNextPuzzle && (
          <button
            type="button"
            onClick={onNextPuzzle}
            className="flex h-12 w-full items-center justify-center bg-wordle-green text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
          >
            Next Puzzle
          </button>
        )
      ) : (
        <NextPuzzleCountdown />
      )}

      {gameMode === 'daily' && won && (
        <div className="space-y-3 rounded-sm border border-wordle-green/30 bg-[#f4faf4] px-3 py-3">
          <p className="text-center text-[13px] leading-snug text-wordle-text">
            Want to keep whittling? Replay past puzzles or play endless rounds.
          </p>
          <div className="flex gap-2">
            <a
              href={getModeUrl('archive')}
              className="flex h-11 flex-1 items-center justify-center rounded-sm border-2 border-wordle-text bg-wordle-bg px-2 text-[11px] font-bold uppercase tracking-wide text-wordle-text transition hover:bg-black/5"
            >
              Whittle Archive
            </a>
            <a
              href={getModeUrl('unlimited')}
              className="flex h-11 flex-1 items-center justify-center rounded-sm bg-wordle-green px-2 text-[11px] font-bold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Whittle Unlimited
            </a>
          </div>
        </div>
      )}

      <div className="rounded-sm border border-[#e8c872]/40 bg-[#fff8e8] px-3 py-3">
        <p className="text-center text-[13px] leading-snug text-[#5c4a1e]">
          Enjoying Whittle Daily? Help keep the servers running by{' '}
          <a
            href={COFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#a8841a] underline decoration-[#e8c872] underline-offset-2 transition hover:text-[#7a6514]"
          >
            buying the developer a coffee!
          </a>{' '}
          ☕
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-12 flex-1 items-center justify-center bg-wordle-text text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={showNativeShare ? handleShare : handleCopy}
          className="flex h-12 flex-1 items-center justify-center border-2 border-wordle-text bg-wordle-bg text-sm font-bold uppercase tracking-wide text-wordle-text transition hover:bg-black/5"
        >
          Share Score
        </button>
      </div>
    </div>
  )
}
