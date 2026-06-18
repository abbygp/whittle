import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadDictionary } from '../lib/dictionary'
import {
  getArchivePuzzle,
  getDailyPuzzle,
  getYesterdayPuzzle,
  msUntilNextPuzzle,
} from '../lib/dailyPuzzle'
import { loadOrCreateDailyGame, saveDailyGame } from '../lib/dailySave'
import {
  applyAction,
  checkDeadEndLoss,
  createInitialState,
} from '../lib/gameLogic'
import { CoffeeLink } from './CoffeeLink'
import { GameFooter } from './GameFooter'
import { GameHeader } from './GameHeader'
import { GameModal } from './GameModal'
import { AnswerModal } from './AnswerModal'
import { InfoModal, type InfoModalKind } from './InfoModal'
import { LetterKeyboard } from './LetterKeyboard'
import { Toast } from './Toast'
import { WordleBoard, type EditMode } from './WordleBoard'
import {
  hasRecordedResult,
  loadStats,
  recordResult,
  type PlayerStats,
} from '../lib/stats'
import { hasSeenHowToPlay, markHowToPlaySeen } from '../lib/onboarding'
import type { GameMode } from '../lib/gameMode'
import { getModeUrl, isPremiumMode } from '../lib/gameMode'
import { createUnlimitedSession } from '../lib/unlimitedPuzzle'

function createSession(mode: GameMode, archivePuzzleNumber?: number) {
  if (mode === 'unlimited') {
    const session = createUnlimitedSession()
    return {
      puzzle: session.puzzle,
      gameState: session.gameState,
      statsRecorded: true,
    }
  }

  if (mode === 'archive') {
    const puzzle =
      archivePuzzleNumber !== undefined
        ? getArchivePuzzle(archivePuzzleNumber)
        : null

    if (!puzzle) {
      const session = createUnlimitedSession()
      return {
        puzzle: session.puzzle,
        gameState: session.gameState,
        statsRecorded: true,
      }
    }

    return {
      puzzle,
      gameState: createInitialState(puzzle),
      statsRecorded: true,
    }
  }

  const puzzle = getDailyPuzzle()
  const save = loadOrCreateDailyGame(puzzle)
  const statsRecorded =
    save.statsRecorded || hasRecordedResult(puzzle.id)

  return {
    puzzle,
    gameState: save.gameState,
    statsRecorded,
  }
}

interface WhittleGameProps {
  gameMode?: GameMode
  archivePuzzleNumber?: number
}

export function WhittleGame({
  gameMode = 'daily',
  archivePuzzleNumber,
}: WhittleGameProps) {
  const isUnlimited = gameMode === 'unlimited'
  const isArchive = gameMode === 'archive'
  const isPremium = isPremiumMode(gameMode)
  const initialSession = useMemo(
    () => createSession(gameMode, archivePuzzleNumber),
    [gameMode, archivePuzzleNumber],
  )
  const [dictionary, setDictionary] = useState<Set<string> | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [dailyPuzzle, setDailyPuzzle] = useState(initialSession.puzzle)
  const yesterdayPuzzle = useMemo(
    () => (isPremium ? null : getYesterdayPuzzle()),
    [dailyPuzzle.id, isPremium],
  )
  const [gameState, setGameState] = useState(initialSession.gameState)
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [mode, setMode] = useState<EditMode>('drop')
  const [selectedGap, setSelectedGap] = useState<number | null>(null)
  const [endModalOpen, setEndModalOpen] = useState(
    () => !isPremium && initialSession.gameState.status !== 'playing',
  )
  const [answerModalOpen, setAnswerModalOpen] = useState(false)
  const [gaveUp, setGaveUp] = useState(false)
  const [infoModal, setInfoModal] = useState<InfoModalKind | null>(null)
  const [stats, setStats] = useState<PlayerStats>(() => loadStats())
  const mainRef = useRef<HTMLElement>(null)
  const prevStatusRef = useRef(gameState.status)
  const puzzleIdRef = useRef(dailyPuzzle.id)
  const statsRecordedRef = useRef(initialSession.statsRecorded)
  const skipEndModalRef = useRef(false)

  useEffect(() => {
    if (isPremium) return

    let timeoutId = 0

    const scheduleNextPuzzleCheck = () => {
      timeoutId = window.setTimeout(() => {
        const nextPuzzle = getDailyPuzzle()
        setDailyPuzzle((current) =>
          current.id === nextPuzzle.id ? current : nextPuzzle,
        )
        scheduleNextPuzzleCheck()
      }, msUntilNextPuzzle() + 250)
    }

    scheduleNextPuzzleCheck()
    return () => window.clearTimeout(timeoutId)
  }, [isPremium])

  useEffect(() => {
    if (isPremium || puzzleIdRef.current === dailyPuzzle.id) return

    puzzleIdRef.current = dailyPuzzle.id
    const save = loadOrCreateDailyGame(dailyPuzzle)
    statsRecordedRef.current =
      save.statsRecorded || hasRecordedResult(dailyPuzzle.id)
    setGameState(save.gameState)
    setEndModalOpen(false)
    setMode('drop')
    setSelectedGap(null)
  }, [dailyPuzzle, isPremium])

  useEffect(() => {
    if (isPremium) return

    saveDailyGame({
      puzzleId: dailyPuzzle.id,
      gameState,
      statsRecorded: statsRecordedRef.current,
    })
  }, [dailyPuzzle.id, gameState, isPremium])

  useEffect(() => {
    loadDictionary()
      .then(setDictionary)
      .catch(() => setLoadError('Could not load dictionary.'))
  }, [])

  useEffect(() => {
    if (!dictionary || hasSeenHowToPlay()) return
    setInfoModal('how-to')
  }, [dictionary])

  useEffect(() => {
    const prevStatus = prevStatusRef.current
    prevStatusRef.current = gameState.status

    if (prevStatus === 'playing' && gameState.status !== 'playing') {
      if (skipEndModalRef.current) {
        skipEndModalRef.current = false
      } else if (!isPremium) {
        setEndModalOpen(true)
      }

      if (!isPremium && !statsRecordedRef.current) {
        setStats(recordResult(gameState.status, dailyPuzzle.id))
        statsRecordedRef.current = true
        saveDailyGame({
          puzzleId: dailyPuzzle.id,
          gameState,
          statsRecorded: true,
        })
      }
    }
  }, [dailyPuzzle.id, gameState, isPremium])

  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' })
  }, [gameState.turnsUsed])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2000)
  }, [])

  const triggerShake = useCallback(() => {
    setShake(true)
    window.setTimeout(() => setShake(false), 500)
  }, [])

  const applyPlayerAction = useCallback(
    (action: Parameters<typeof applyAction>[1]) => {
      if (!dictionary) return

      setGameState((prev) => {
        if (prev.status !== 'playing') return prev

        const { next, invalid } = applyAction(prev, action, dictionary)
        if (invalid) {
          triggerShake()
          showToast('Not in word list')
          return prev
        }

        const withDeadEnd = checkDeadEndLoss(next, dictionary)
        if (withDeadEnd.status === 'lost' && next.status === 'playing') {
          showToast('No moves left')
        }
        return withDeadEnd
      })
    },
    [dictionary, showToast, triggerShake],
  )

  const handleDrop = useCallback(
    (index: number) => {
      setSelectedGap(null)
      applyPlayerAction({ type: 'delete', index })
    },
    [applyPlayerAction],
  )

  const handleSelectGap = useCallback((index: number) => {
    setSelectedGap(index)
  }, [])

  const handlePickLetter = useCallback(
    (letter: string) => {
      if (selectedGap === null) {
        showToast('Pick a + slot first')
        return
      }
      applyPlayerAction({ type: 'insert', index: selectedGap, letter })
      setSelectedGap(null)
    },
    [applyPlayerAction, selectedGap, showToast],
  )

  const handleModeChange = useCallback((nextMode: EditMode) => {
    setMode(nextMode)
    setSelectedGap(null)
  }, [])

  const startNextPuzzle = useCallback(() => {
    const session = createUnlimitedSession(dailyPuzzle.id)
    puzzleIdRef.current = session.puzzle.id
    setDailyPuzzle(session.puzzle)
    setGameState(session.gameState)
    setEndModalOpen(false)
    setAnswerModalOpen(false)
    setGaveUp(false)
    setMode('drop')
    setSelectedGap(null)
  }, [dailyPuzzle.id])

  const handleGiveUp = useCallback(() => {
    if (gameState.status !== 'playing') return

    skipEndModalRef.current = true
    setGaveUp(true)
    setGameState((prev) => ({ ...prev, status: 'lost' }))
    setAnswerModalOpen(true)
    setMode('drop')
    setSelectedGap(null)
  }, [gameState.status])

  const isPlaying = gameState.status === 'playing'

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <p className="text-wordle-text">{loadError}</p>
      </div>
    )
  }

  if (!dictionary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-wordle-border border-t-wordle-green" />
        <p className="text-sm font-medium text-wordle-gray">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <CoffeeLink />
      <GameHeader gameState={gameState} gameMode={gameMode} />

      <main
        ref={mainRef}
        className="mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 pt-8 pb-6"
      >
        <p className="mb-6 max-w-sm text-center text-[15px] leading-snug text-wordle-text">
          {dailyPuzzle.description}
        </p>

        {!isPlaying && (
          <div className="mb-4 flex flex-col items-center gap-2">
            {isPremium ? (
              <>
                <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-wordle-gray">
                  {gameState.status === 'won'
                    ? isArchive
                      ? 'Nice work'
                      : 'Nice work — keep going'
                    : gaveUp
                      ? 'Answer revealed — try another'
                      : 'No moves left — try another'}
                </p>
                {isUnlimited && (
                  <button
                    type="button"
                    onClick={startNextPuzzle}
                    className="text-[12px] font-bold uppercase tracking-wide text-wordle-green underline decoration-wordle-border underline-offset-4 transition hover:brightness-110"
                  >
                    Next puzzle
                  </button>
                )}
                {isArchive && (
                  <a
                    href={getModeUrl('archive')}
                    className="text-[12px] font-bold uppercase tracking-wide text-wordle-green underline decoration-wordle-border underline-offset-4 transition hover:brightness-110"
                  >
                    Back to archive
                  </a>
                )}
                {gaveUp && (
                  <button
                    type="button"
                    onClick={() => setAnswerModalOpen(true)}
                    className="text-[12px] font-bold uppercase tracking-wide text-wordle-text underline decoration-wordle-border underline-offset-4 transition hover:text-wordle-green"
                  >
                    View answer
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEndModalOpen(true)}
                  className="text-[12px] font-bold uppercase tracking-wide text-wordle-text underline decoration-wordle-border underline-offset-4 transition hover:text-wordle-green"
                >
                  View results
                </button>
              </>
            ) : (
              <>
                <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-wordle-gray">
                  {gameState.status === 'won'
                    ? 'Come back tomorrow for a new puzzle'
                    : 'No moves left — try again tomorrow'}
                </p>
                <button
                  type="button"
                  onClick={() => setEndModalOpen(true)}
                  className="text-[12px] font-bold uppercase tracking-wide text-wordle-text underline decoration-wordle-border underline-offset-4 transition hover:text-wordle-green"
                >
                  View results
                </button>
              </>
            )}
          </div>
        )}

        <WordleBoard
          gameState={gameState}
          shake={shake}
          disabled={!isPlaying}
          mode={mode}
          selectedGap={selectedGap}
          onModeChange={handleModeChange}
          onDrop={handleDrop}
          onSelectGap={handleSelectGap}
        />

        {isPremium && isPlaying && (
          <button
            type="button"
            onClick={handleGiveUp}
            className="mt-6 text-[12px] font-semibold uppercase tracking-widest text-wordle-gray underline decoration-wordle-border underline-offset-4 transition hover:text-wordle-text"
          >
            Give up · Show answer
          </button>
        )}
      </main>

      {isPlaying && (
        <div className="shrink-0 border-t border-wordle-border bg-wordle-bg">
          <p className="pt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-wordle-gray">
            {mode === 'add'
              ? selectedGap === null
                ? 'Tap + then a letter'
                : 'Choose a letter'
              : 'Switch to Add to use keyboard'}
          </p>
          <LetterKeyboard
            disabled={mode !== 'add' || selectedGap === null}
            onPick={handlePickLetter}
          />
        </div>
      )}

      <GameFooter
        gameMode={gameMode}
        onYesterday={() => setInfoModal('yesterday')}
        onStats={() => setInfoModal('stats')}
        onHowToPlay={() => setInfoModal('how-to')}
      />

      <Toast message={toast} />
      <InfoModal
        kind={infoModal}
        puzzle={dailyPuzzle}
        yesterdayPuzzle={yesterdayPuzzle ?? getYesterdayPuzzle()}
        stats={stats}
        turnsUsed={gameState.turnsUsed}
        par={gameState.par}
        status={gameState.status}
        startWord={gameState.startWord}
        targetWord={gameState.targetWord}
        moveHistory={gameState.moveHistory}
        onShareMessage={showToast}
        onClose={() => {
          if (infoModal === 'how-to') markHowToPlaySeen()
          setInfoModal(null)
        }}
      />
      <AnswerModal
        open={answerModalOpen}
        puzzle={dailyPuzzle}
        onClose={() => setAnswerModalOpen(false)}
        onNextPuzzle={startNextPuzzle}
      />
      <GameModal
        open={endModalOpen}
        status={gameState.status}
        startWord={gameState.startWord}
        targetWord={gameState.targetWord}
        turnsUsed={gameState.turnsUsed}
        par={gameState.par}
        puzzleId={dailyPuzzle.id}
        moveHistory={gameState.moveHistory}
        stats={stats}
        gameMode={gameMode}
        onClose={() => setEndModalOpen(false)}
        onShareMessage={showToast}
        onNextPuzzle={isUnlimited ? startNextPuzzle : undefined}
      />
    </div>
  )
}
