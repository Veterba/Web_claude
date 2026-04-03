import { useState, useEffect, useRef } from 'react'

export function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const skipRef = useRef(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    skipRef.current = false

    if (!text) {
      setDone(true)
      return
    }

    let i = 0
    const id = setInterval(() => {
      if (skipRef.current) {
        setDisplayed(text)
        setDone(true)
        clearInterval(id)
        return
      }
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        setDone(true)
        clearInterval(id)
      }
    }, speed)

    return () => clearInterval(id)
  }, [text, speed])

  const skip = () => { skipRef.current = true }

  return { displayed, done, skip }
}
