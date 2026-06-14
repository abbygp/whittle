import { useEffect, useState } from 'react'
import { formatCountdown } from '../lib/countdown'
import { msUntilNextPuzzle } from '../lib/dailyPuzzle'

interface NextPuzzleCountdownProps {
  className?: string
}

export function NextPuzzleCountdown({ className = '' }: NextPuzzleCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(() => msUntilNextPuzzle())

  useEffect(() => {
    const tick = () => setRemainingMs(msUntilNextPuzzle())
    tick()
    const intervalId = window.setInterval(tick, 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <p className={`text-center text-[13px] text-wordle-gray ${className}`.trim()}>
      Next puzzle in{' '}
      <span className="font-bold tabular-nums tracking-wide text-wordle-text">
        {formatCountdown(remainingMs)}
      </span>
    </p>
  )
}
