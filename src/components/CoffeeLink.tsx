const COFFEE_URL = 'https://buymeacoffee.com/abbygprince'

export function CoffeeLink() {
  return (
    <a
      href={COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      className="fixed right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-sm text-wordle-gray transition hover:bg-black/5 hover:text-wordle-text sm:right-4 sm:top-4"
    >
      <svg
        aria-hidden
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2v2" />
        <path d="M14 2v2" />
        <path d="M16 8a4 4 0 0 1-8 0V6h8v2Z" />
        <path d="M6 8v1a6 6 0 0 0 12 0V8" />
        <path d="M4 8h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      </svg>
    </a>
  )
}
