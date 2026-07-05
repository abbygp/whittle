import { motion } from 'framer-motion'
import { CoffeeLink } from './CoffeeLink'
import { HamburgerMenu } from './HamburgerMenu'
import {
  getSupportMailtoUrl,
  STRIPE_PAYMENT_LINK,
  UNLIMITED_PRICE_LABEL,
} from '../lib/support'

export function UnlimitedPaywall() {
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

          <a
            href={getSupportMailtoUrl()}
            className="flex h-11 w-full items-center justify-center border border-wordle-border text-[12px] font-bold uppercase tracking-widest text-wordle-gray transition hover:border-wordle-green hover:text-wordle-green"
          >
            Having issues? Email me
          </a>
        </motion.div>
      </div>
    </div>
  )
}
