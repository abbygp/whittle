import { useEffect, useRef } from 'react'

const BMC_SCRIPT_SRC = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'

interface BuyMeCoffeeButtonProps {
  className?: string
  text?: string
}

export function BuyMeCoffeeButton({
  className = '',
  text = 'Buy me a coffee',
}: BuyMeCoffeeButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const script = document.createElement('script')
    script.src = BMC_SCRIPT_SRC
    script.async = true
    script.setAttribute('data-name', 'bmc-button')
    script.setAttribute('data-slug', 'abbygprince')
    script.setAttribute('data-color', '#FFDD00')
    script.setAttribute('data-emoji', '')
    script.setAttribute('data-font', 'Poppins')
    script.setAttribute('data-text', text)
    script.setAttribute('data-outline-color', '#000000')
    script.setAttribute('data-font-color', '#000000')
    script.setAttribute('data-coffee-color', '#ffffff')

    container.appendChild(script)

    return () => {
      container.replaceChildren()
    }
  }, [text])

  return <div ref={containerRef} className={className} />
}
