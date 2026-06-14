import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadDictionary } from '../lib/dictionary'
import {
  getDailyPuzzle,
  getYesterdayPuzzle,
  msUntilNextPuzzle,
} from '../lib/dailyPuzzle'
import { loadOrCreateDailyGame, saveDailyGame } from '../lib/dailySave'
import {
  applyAction,
  checkDeadEndLoss,
} from '../lib/gameLogic'
import { GameFooter } from './GameFooter'
import { GameHeader } from './GameHeader'
import { GameModal } from './GameModal'
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

function createSession(puzzle = getDailyPuzzle()) {
  const save = loadOrCreateDailyGame(puzzle)
  const statsRecorded =
    save.statsRecorded || hasRecordedResult(puzzle.id)

  return {
    puzzle,
    gameState: save.gameState,
    statsRecorded,
  }
}

export function WhittleGame() {
  const initialSession = useMemo(() => createSession(), [])
  const [dictionary, setDictionary] = useState<Set<string> | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [dailyPuzzle, setDailyPuzzle] = useState(initialSession.puzzle)
  const yesterdayPuzzle = useMemo(() => getYesterdayPuzzle(), [dailyPuzzle.id])
  const [gameState, setGameState] = useState(initialSession.gameState)
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [mode, setMode] = useState<EditMode>('drop')
  const [selectedGap, setSelectedGap] = useState<number | null>(null)
  const [endModalOpen, setEndModalOpen] = useState(false)
  const [infoModal, setInfoModal] = useState<InfoModalKind | null>(null)
  const [stats, setStats] = useState<PlayerStats>(() => loadStats())
  const mainRef = useRef<HTMLElement>(null)
  const prevStatusRef = useRef(gameState.status)
  const puzzleIdRef = useRef(dailyPuzzle.id)
  const statsRecordedRef = useRef(initialSession.statsRecorded)

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (puzzleIdRef.current === dailyPuzzle.id) return

    puzzleIdRef.current = dailyPuzzle.id
    const save = loadOrCreateDailyGame(dailyPuzzle)
    statsRecordedRef.current =
      save.statsRecorded || hasRecordedResult(dailyPuzzle.id)
    setGameState(save.gameState)
    setEndModalOpen(false)
    setMode('drop')
    setSelectedGap(null)
  }, [dailyPuzzle])

  useEffect(() => {
    saveDailyGame({
      puzzleId: dailyPuzzle.id,
      gameState,
      statsRecorded: statsRecordedRef.current,
    })
  }, [dailyPuzzle.id, gameState])

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
      setEndModalOpen(true)

      if (!statsRecordedRef.current) {
        setStats(recordResult(gameState.status, dailyPuzzle.id))
        statsRecordedRef.current = true
        saveDailyGame({
          puzzleId: dailyPuzzle.id,
          gameState,
          statsRecorded: true,
        })
      }
    }
  }, [dailyPuzzle.id, gameState])

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
      <GameHeader gameState={gameState} />

      <main
        ref={mainRef}
        className="mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 pt-8 pb-6"
      >
        <p className="mb-6 max-w-sm text-center text-[15px] leading-snug text-wordle-text">
          {dailyPuzzle.description}
        </p>

        {!isPlaying && (
          <p className="mb-4 text-center text-[12px] font-semibold uppercase tracking-widest text-wordle-gray">
            {gameState.status === 'won'
              ? 'Come back tomorrow for a new puzzle'
              : 'No moves left — try again tomorrow'}
          </p>
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
        onYesterday={() => setInfoModal('yesterday')}
        onStats={() => setInfoModal('stats')}
        onHowToPlay={() => setInfoModal('how-to')}
      />

      <Toast message={toast} />
      <InfoModal
        kind={infoModal}
        puzzle={dailyPuzzle}
        yesterdayPuzzle={yesterdayPuzzle}
        stats={stats}
        turnsUsed={gameState.turnsUsed}
        par={gameState.par}
        status={gameState.status}
        onClose={() => {
          if (infoModal === 'how-to') markHowToPlaySeen()
          setInfoModal(null)
        }}
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
        onClose={() => setEndModalOpen(false)}
        onShareMessage={showToast}
      />
    </div>
  )
}
