import { motion } from 'framer-motion'
import { CoffeeLink } from './CoffeeLink'
import { HamburgerMenu } from './HamburgerMenu'
import {
  getArchivePuzzles,
  getDateLabelForPuzzleNumber,
} from '../lib/dailyPuzzle'
import { getArchivePuzzleUrl, getModeUrl } from '../lib/gameMode'

export function ArchivePicker() {
  const puzzles = [...getArchivePuzzles()].reverse()

  return (
    <div className="flex min-h-dvh flex-col bg-wordle-bg">
      <HamburgerMenu />
      <CoffeeLink />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-8 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="text-[28px] font-bold leading-none tracking-[0.2em] sm:text-[36px]">
            WHITTLE
          </h1>
          <p className="mt-2 text-[10px] font-bold uppercase leading-none tracking-[0.35em] text-wordle-green">
            Archive
          </p>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-wordle-text">
            Replay any past daily puzzle.
          </p>
        </motion.div>

        {puzzles.length === 0 ? (
          <p className="text-center text-[14px] text-wordle-gray">
            No past puzzles yet. Check back tomorrow!
          </p>
        ) : (
          <ul className="space-y-2">
            {puzzles.map((puzzle) => (
              <li key={puzzle.id}>
                <a
                  href={getArchivePuzzleUrl(puzzle.id)}
                  className="flex items-center justify-between rounded-sm border border-wordle-border bg-black/[0.02] px-4 py-3 transition hover:border-wordle-green hover:bg-black/[0.04]"
                >
                  <div className="min-w-0 text-left">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-wordle-text">
                      Whittle #{puzzle.id}
                    </p>
                    <p className="mt-1 truncate text-[13px] text-wordle-gray">
                      {puzzle.startWord} → {puzzle.targetWord}
                    </p>
                  </div>
                  <span className="ml-3 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-wordle-gray">
                    {getDateLabelForPuzzleNumber(puzzle.id)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a
            href={getModeUrl('daily')}
            className="text-[12px] font-medium text-wordle-gray transition hover:text-wordle-text sm:text-[13px]"
          >
            Daily Puzzle
          </a>
        </div>
      </div>
    </div>
  )
}
