import { useState } from 'react'
import { ArchivePicker } from './components/ArchivePicker'
import { UnlimitedRoute } from './components/UnlimitedRoute'
import { WhittleGame } from './components/WhittleGame'
import {
  getArchivePuzzleNumberFromLocation,
  getGameModeFromLocation,
  isPremiumMode,
} from './lib/gameMode'
import { resolvePremiumUnlockFromUrl } from './lib/unlimitedAccess'

const ACTIVATION_MESSAGE = 'Unlimited & Archive activated! 🪵'

function App() {
  const mode = getGameModeFromLocation()
  const archivePuzzleNumber = getArchivePuzzleNumberFromLocation()
  const [initialUnlock] = useState(() => resolvePremiumUnlockFromUrl())
  const [hasUnlimited, setHasUnlimited] = useState(initialUnlock.unlocked)
  const [activationToast] = useState<string | null>(
    initialUnlock.fromStripe ? ACTIVATION_MESSAGE : null,
  )

  if (isPremiumMode(mode)) {
    return (
      <UnlimitedRoute
        hasUnlimited={hasUnlimited}
        onUnlock={() => setHasUnlimited(true)}
        activationToast={activationToast}
      >
        {mode === 'archive' && archivePuzzleNumber === null ? (
          <ArchivePicker />
        ) : (
          <WhittleGame
            gameMode={mode}
            archivePuzzleNumber={archivePuzzleNumber ?? undefined}
          />
        )}
      </UnlimitedRoute>
    )
  }

  return <WhittleGame gameMode={mode} />
}

export default App
