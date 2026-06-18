import { useEffect, useState } from 'react'
import { ArchivePicker } from './components/ArchivePicker'
import { WhittleGame } from './components/WhittleGame'
import { UnlimitedPaywall } from './components/UnlimitedPaywall'
import {
  getArchivePuzzleNumberFromLocation,
  getGameModeFromLocation,
  isPremiumMode,
} from './lib/gameMode'
import {
  checkUrlUnlock,
  hasUnlimitedAccess,
} from './lib/unlimitedAccess'

function App() {
  const mode = getGameModeFromLocation()
  const archivePuzzleNumber = getArchivePuzzleNumberFromLocation()
  const [premiumUnlocked, setPremiumUnlocked] = useState(
    () => hasUnlimitedAccess(),
  )

  useEffect(() => {
    if (checkUrlUnlock()) setPremiumUnlocked(true)
  }, [])

  if (isPremiumMode(mode) && !premiumUnlocked) {
    return <UnlimitedPaywall onUnlock={() => setPremiumUnlocked(true)} />
  }

  if (mode === 'archive' && archivePuzzleNumber === null) {
    return <ArchivePicker />
  }

  return (
    <WhittleGame
      gameMode={mode}
      archivePuzzleNumber={archivePuzzleNumber ?? undefined}
    />
  )
}

export default App
