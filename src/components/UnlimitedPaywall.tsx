import { motion } from 'framer-motion'
import { useState } from 'react'
import { CoffeeLink } from './CoffeeLink'
import { HamburgerMenu } from './HamburgerMenu'
import { getModeUrl } from '../lib/gameMode'
import {
  getSupportMailtoUrl,
  STRIPE_PAYMENT_LINK,
  UNLIMITED_PRICE_LABEL,
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
    <div className="flex min-h-dvh flex-col bg-wordle-bg">
      <HamburgerMenu />
      <CoffeeLink />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 pb-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-[32px] font-bold leading-none tracking-[0.2em] sm:text-[40px]">
              WHITTLE
            </h1>
            <p className="mt-2 text-[10px] font-bold uppercase leading-none tracking-[0.35em] text-wordle-green">
              Unlimited &amp; Archive
            </p>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-[15px] leading-relaxed text-wordle-text">
              One unlock opens both Whittle Unlimited and the full daily puzzle
              Archive — no account required.
            </p>
            <ul className="mx-auto max-w-sm space-y-2 text-left text-[14px] leading-relaxed text-wordle-gray">
              <li className="flex gap-2">
                <span aria-hidden className="text-wordle-green">
                  ✓
                </span>
                Replay every past daily puzzle in the Archive
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-wordle-green">
                  ✓
                </span>
                Practice with endless random puzzles
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-wordle-green">
                  ✓
                </span>
                One purchase — no account required
              </li>
            </ul>
          </div>

          <a
            href={STRIPE_PAYMENT_LINK}
            className="flex h-14 w-full items-center justify-center bg-wordle-green text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
          >
            Unlock for {UNLIMITED_PRICE_LABEL}
          </a>

          <div className="space-y-3 border-t border-wordle-border pt-6">
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
              Unlock with code
            </button>
          </div>

          <a
            href={getSupportMailtoUrl()}
            className="flex h-11 w-full items-center justify-center border border-wordle-border text-[12px] font-bold uppercase tracking-widest text-wordle-gray transition hover:border-wordle-green hover:text-wordle-green"
          >
            Having issues? Email me
          </a>

          <a
            href={getModeUrl('daily')}
            className="block text-center text-[12px] font-semibold uppercase tracking-widest text-wordle-gray underline decoration-wordle-border underline-offset-4 transition hover:text-wordle-text"
          >
            Back to Daily Puzzle
          </a>
        </motion.div>
      </div>
    </div>
  )
}
