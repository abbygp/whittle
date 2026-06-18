import { motion } from 'framer-motion'
import { useState } from 'react'
import { getModeUrl } from '../lib/gameMode'
import {
  UNLIMITED_PRICE_LABEL,
  UNLIMITED_PRODUCT_URL,
} from '../lib/support'
import { tryUnlockWithCode } from '../lib/unlimitedAccess'

interface UnlimitedPaywallProps {
  onUnlock: () => void
}

export function UnlimitedPaywall({ onUnlock }: UnlimitedPaywallProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleUnlock = () => {
    if (tryUnlockWithCode(code)) {
      setError(null)
      onUnlock()
      return
    }

    setError('Invalid unlock code')
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative w-full max-w-sm rounded-sm bg-wordle-bg px-6 py-6 shadow-2xl"
      >
        <a
          href={getModeUrl('daily')}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-sm text-wordle-text transition hover:bg-black/5"
        >
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </a>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-[32px] font-bold leading-none tracking-[0.2em] sm:text-[40px]">
              WHITTLE
            </h1>
            <p className="mt-2 text-[10px] font-bold uppercase leading-none tracking-[0.35em] text-wordle-green">
              Unlimited
            </p>
          </div>

        <p className="text-center text-[15px] leading-relaxed text-wordle-text">
          Want to keep whittling? Unlock Whittle Unlimited to play past puzzles
          and endless random rounds!
        </p>

        <a
          href={UNLIMITED_PRODUCT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center bg-wordle-green text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
        >
          Unlock for {UNLIMITED_PRICE_LABEL}
        </a>

        <div className="space-y-3 border-t border-wordle-border pt-5">
          <p className="text-center text-[13px] text-wordle-gray">
            Already purchased? Enter your unlock code.
          </p>
          <input
            type="text"
            value={code}
            onChange={(event) => {
              setCode(event.target.value)
              setError(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleUnlock()
            }}
            placeholder="Unlock code"
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full border-2 border-wordle-border bg-wordle-bg px-3 text-center text-[15px] font-semibold uppercase tracking-widest text-wordle-text outline-none transition focus:border-wordle-green"
          />
          {error && (
            <p className="text-center text-[12px] font-semibold text-red-600">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleUnlock}
            className="flex h-12 w-full items-center justify-center border-2 border-wordle-text bg-wordle-bg text-sm font-bold uppercase tracking-wide text-wordle-text transition hover:bg-black/5"
          >
            Unlock
          </button>
        </div>

        <a
          href={getModeUrl('daily')}
          className="block text-center text-[12px] font-semibold uppercase tracking-widest text-wordle-gray underline decoration-wordle-border underline-offset-4 transition hover:text-wordle-text"
        >
          Back to Daily Puzzle
        </a>
        </div>
      </motion.div>
    </div>
  )
}
