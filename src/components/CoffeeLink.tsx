import { COFFEE_URL } from '../lib/support'

export function CoffeeLink() {
  return (
    <a
      href={COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      className="fixed right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full text-[20px] leading-none transition hover:bg-[#fff8e8] sm:right-4 sm:top-4"
    >
      ☕
    </a>
  )
}
