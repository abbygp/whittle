import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { GameStatus, MoveRecord } from '../types/game'
import {
  buildShareText,
  canNativeShare,
  copyShareText,
  getPlayUrl,
  nativeShare,
} from '../lib/share'
import { formatScore, scoreVsPar } from '../lib/score'

interface GameModalProps {
  status: GameStatus
  startWord: string
  targetWord: string
  turnsUsed: number
  par: number
  puzzleId: number
  moveHistory: MoveRecord[]
  onShareMessage?: (message: string) => void
}

export function GameModal({
  status,
  startWord,
  targetWord,
  turnsUsed,
  par,
  puzzleId,
  moveHistory,
  onShareMessage,
}: GameModalProps) {
  const [copied, setCopied] = useState(false)

  const shareText = useMemo(
    () =>
      buildShareText(
        { startWord, targetWord, turnsUsed, par, status, moveHistory },
        puzzleId,
        getPlayUrl(),
      ),
    [startWord, targetWord, turnsUsed, par, status, moveHistory, puzzleId],
  )
  const showNativeShare = canNativeShare()

  if (status === 'playing') return null

  const won = status === 'won'
  const vsPar = scoreVsPar(turnsUsed, par)

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

        <pre className="mt-4 whitespace-pre-wrap rounded-sm border border-wordle-border bg-black/[0.03] px-3 py-2 text-left text-[12px] leading-relaxed text-wordle-gray">
          {shareText}
        </pre>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="h-12 flex-1 bg-wordle-text text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {showNativeShare && (
            <button
              type="button"
              onClick={handleShare}
              className="h-12 flex-1 border-2 border-wordle-text bg-wordle-bg text-sm font-bold uppercase tracking-wide text-wordle-text transition hover:bg-black/5"
            >
              Share
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
