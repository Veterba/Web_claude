import { useState, useEffect } from 'react'

export function useBootSequence(lines) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!lines || lines.length === 0) {
      setDone(true)
      return
    }

    let current = 0
    let cancelled = false

    function showNext() {
      if (cancelled) return
      current++
      setVisibleCount(current)
      if (current >= lines.length) {
        setDone(true)
        return
      }
      const delay = lines[current]?.delay ?? 300
      setTimeout(showNext, delay)
    }

    const firstDelay = lines[0]?.delay ?? 300
    const t = setTimeout(showNext, firstDelay)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [])

  return { visibleLines: lines.slice(0, visibleCount), done }
}
