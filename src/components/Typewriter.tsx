import { useEffect, useState } from 'react'

const Typewriter = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    if (currentIdx < text.length) {
      setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIdx])
        setCurrentIdx(prevIdx => prevIdx + 1)
      }, 30)
    } else {
      onComplete()
    }
  }, [currentIdx, text, onComplete])

  return <span className="typewriter">{displayedText}</span>
}

export default Typewriter
