import { useEffect, useRef, useState } from 'react'
import { getModeUrl } from '../lib/gameMode'

const menuButtonClass =
  'flex h-9 w-9 items-center justify-center rounded-sm border border-wordle-border text-wordle-text transition hover:border-wordle-green hover:text-wordle-green'

const menuItemClass =
  'block px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-wordle-text transition hover:bg-black/[0.04] hover:text-wordle-green'

export function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('touchstart', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="fixed left-3 top-3 z-40 sm:left-4 sm:top-4">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className={menuButtonClass}
      >
        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+0.5rem)] min-w-[11rem] overflow-hidden rounded-sm border border-wordle-border bg-wordle-bg shadow-lg"
        >
          <a
            role="menuitem"
            href={getModeUrl('unlimited')}
            className={menuItemClass}
            onClick={() => setOpen(false)}
          >
            Whittle Unlimited
          </a>
          <a
            role="menuitem"
            href={getModeUrl('archive')}
            className={`${menuItemClass} border-t border-wordle-border`}
            onClick={() => setOpen(false)}
          >
            Whittle Archive
          </a>
        </div>
      )}
    </div>
  )
}
