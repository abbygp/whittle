import { AnimatePresence, motion } from 'framer-motion'

interface ToastProps {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="pointer-events-none fixed left-1/2 top-20 z-50 -translate-x-1/2 bg-wordle-text px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
