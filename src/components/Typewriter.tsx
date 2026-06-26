import { useEffect, useRef, useState } from 'react'

type Props = {
  text: string
  speed?: number // ms per character
  startDelay?: number
  className?: string
  onDone?: () => void
  caret?: boolean
}

// A transmission decoding itself, character by character. Tapping skips to the
// end — players huddled around one phone should never wait on a machine.
export default function Typewriter({
  text,
  speed = 22,
  startDelay = 250,
  className = '',
  onDone,
  caret = true,
}: Props) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    setCount(0)
    setDone(false)
    let i = 0
    let timer: number
    const startTimer = window.setTimeout(function tick() {
      i += 1
      setCount(i)
      if (i >= text.length) {
        setDone(true)
        doneRef.current?.()
        return
      }
      // brief, organic pauses at sentence breaks
      const ch = text[i - 1]
      const delay = ch === '.' || ch === '—' || ch === '?' ? speed * 7 : speed
      timer = window.setTimeout(tick, delay)
    }, startDelay)

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(timer)
    }
  }, [text, speed, startDelay])

  const skip = () => {
    if (done) return
    setCount(text.length)
    setDone(true)
    doneRef.current?.()
  }

  return (
    <p
      className={`${className} ${caret && !done ? 'caret' : ''}`}
      onClick={skip}
    >
      {text.slice(0, count)}
    </p>
  )
}
