import { useEffect, useState, type ReactNode } from 'react'
import { Toast } from './Toast'
import { UnlimitedPaywall } from './UnlimitedPaywall'

interface UnlimitedRouteProps {
  hasUnlimited: boolean
  activationToast: string | null
  children: ReactNode
}

export function UnlimitedRoute({
  hasUnlimited,
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
    return <UnlimitedPaywall />
  }

  return (
    <>
      <Toast message={toast} />
      {children}
    </>
  )
}
