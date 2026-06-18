import type { GameMode } from '../lib/gameMode'
import { getModeUrl } from '../lib/gameMode'

interface GameFooterProps {
  gameMode: GameMode
  onYesterday: () => void
  onStats: () => void
  onHowToPlay: () => void
}

const linkClass =
  'text-[12px] font-medium text-wordle-gray transition hover:text-wordle-text sm:text-[13px]'

export function GameFooter({
  gameMode,
  onYesterday,
  onStats,
  onHowToPlay,
}: GameFooterProps) {
  return (
    <footer className="shrink-0 border-t border-wordle-border bg-wordle-bg px-4 py-3">
      <div className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {gameMode === 'daily' && (
          <button type="button" onClick={onYesterday} className={linkClass}>
            Yesterday&apos;s Answer
          </button>
        )}
        <button type="button" onClick={onStats} className={linkClass}>
          Show Stats
        </button>
        <button type="button" onClick={onHowToPlay} className={linkClass}>
          How To Play
        </button>
        {gameMode !== 'daily' && (
          <a href={getModeUrl('daily')} className={linkClass}>
            Daily Puzzle
          </a>
        )}
      </div>
    </footer>
  )
}
