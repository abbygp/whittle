import { SolutionBoard } from './BoardPreview'

const EXAMPLE = {
  words: ['TRAN', 'RAN', 'RANG'],
  targetWord: 'RANG',
} as const

export function HowToExample() {
  return (
    <div>
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-widest text-wordle-gray">
        Example
      </p>
      <SolutionBoard
        words={EXAMPLE.words}
        targetWord={EXAMPLE.targetWord}
        showModeToggle
      />
    </div>
  )
}
