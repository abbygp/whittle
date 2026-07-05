import { useEffect, useState, type ReactNode } from 'react'
import { Toast } from './Toast'
import { UnlimitedPaywall } from './UnlimitedPaywall'
import { unlockUnlimited } from '../lib/unlimitedAccess'

interface UnlimitedRouteProps {
  hasUnlimited: boolean
  onUnlock: () => void
  activationToast: string | null
  children: ReactNode
}

export function UnlimitedRoute({
  hasUnlimited,
  onUnlock,
  activationToast,
  children,
}: UnlimitedRouteProps) {
  const [toast, setToast] = useState(activationToast)

  useEffect(() => {
    setToast(activationToast)
  }, [activationToast])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  if (!hasUnlimited) {
    return (
      <UnlimitedPaywall
        onUnlock={() => {
          unlockUnlimited()
          onUnlock()
        }}
      />
    )
  }

  return (
    <>
      <Toast message={toast} />
      {children}
    </>
  )
}
