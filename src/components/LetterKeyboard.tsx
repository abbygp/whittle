const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'] as const

interface LetterKeyboardProps {
  disabled?: boolean
  onPick: (letter: string) => void
}

export function LetterKeyboard({ disabled, onPick }: LetterKeyboardProps) {
  return (
    <div className="mx-auto w-full max-w-lg space-y-1.5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
      {ROWS.map((row) => (
        <div key={row} className="flex justify-center gap-1">
          {row.split('').map((letter) => (
            <button
              key={letter}
              type="button"
              disabled={disabled}
              onClick={() => onPick(letter)}
              className="flex h-14 min-w-[28px] flex-1 items-center justify-center rounded-sm bg-wordle-key text-sm font-bold uppercase text-wordle-text transition hover:bg-[#b8bcc0] disabled:cursor-default disabled:opacity-50 sm:h-[58px] sm:text-[13px]"
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
