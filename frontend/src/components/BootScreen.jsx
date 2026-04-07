import { useEffect, useState, useRef } from 'react'
import { useBootSequence } from '../hooks/useBootSequence'

const BOOT_LINES = [
  { text: 'VellowBIOS (C) 2026 Vellow Systems, Inc.', delay: 100 },
  { text: 'BIOS Version: 08.00.26', delay: 200 },
  { text: '', delay: 150 },
  { text: 'CPU: Creative-Dev-Processor @ MAX GHz', delay: 300 },
  { text: 'Memory Test: ', delay: 400, progress: true },
  { text: '', delay: 200 },
  { text: 'Detecting devices...', delay: 300 },
  { text: '  Primary Master  ..........  portfolio.exe', delay: 400 },
  { text: '  Primary Slave   ..........  None', delay: 250 },
  { text: '', delay: 200 },
  { text: 'Loading VELLOW OS v1.0', delay: 300 },
  { text: '', delay: 100, loading: true },
  { text: '', delay: 600 },
  { text: 'Boot successful.', delay: 200 },
  { text: 'Press any key to continue...', delay: 200, prompt: true },
]

export default function BootScreen({ onComplete }) {
  const { visibleLines, done } = useBootSequence(BOOT_LINES)
  const [progress, setProgress] = useState(0)
  const [loadingWidth, setLoadingWidth] = useState(0)
  const skipRef = useRef(false)

  useEffect(() => {
    if (done) {
      const bar = setInterval(() => {
        setLoadingWidth(w => {
          if (w >= 100) { clearInterval(bar); return 100 }
          return w + 4
        })
      }, 30)
      return () => clearInterval(bar)
    }
  }, [done])

  useEffect(() => {
    const memTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 1337) { clearInterval(memTimer); return 1337 }
        return p + 47
      })
    }, 20)
    return () => clearInterval(memTimer)
  }, [])

  useEffect(() => {
    const skip = () => {
      if (!skipRef.current) {
        skipRef.current = true
        onComplete()
      }
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('click', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('click', skip)
    }
  }, [onComplete])

  const barFilled = Math.floor((progress / 1337) * 20)
  const barEmpty  = 20 - barFilled

  return (
    <div
      className="crt-flicker fixed inset-0 flex flex-col justify-center items-start p-6 sm:p-12"
      style={{ fontFamily: "'Press Start 2P', monospace", background: 'var(--g-bg)' }}
    >
      <div className="w-full max-w-3xl mx-auto">
        {visibleLines.map((line, i) => {
          if (line.progress) {
            return (
              <p key={i} className="text-xs sm:text-sm leading-relaxed text-glow whitespace-pre">
                {line.text}{'█'.repeat(barFilled)}{'░'.repeat(barEmpty)}{' '}
                {String(Math.min(progress, 1337)).padStart(4, ' ')} KB OK
              </p>
            )
          }
          if (line.loading) {
            return (
              <div key={i} className="my-1">
                <p className="text-xs sm:text-sm leading-relaxed text-glow mb-1">
                  {'[' + '█'.repeat(Math.floor(loadingWidth / 5)) + '░'.repeat(20 - Math.floor(loadingWidth / 5)) + ']'} {loadingWidth}%
                </p>
              </div>
            )
          }
          if (line.prompt) {
            return (
              <p key={i} className="text-xs sm:text-sm leading-relaxed text-glow mt-4">
                {line.text}<span className="cursor" />
              </p>
            )
          }
          return (
            <p key={i} className="text-xs sm:text-sm leading-relaxed text-glow whitespace-pre">
              {line.text || '\u00A0'}
            </p>
          )
        })}
      </div>

      <p
        className="fixed bottom-3 right-4 opacity-30"
        style={{ fontSize: '8px', fontFamily: "'Press Start 2P', monospace" }}
      >
        [click or any key to skip]
      </p>
    </div>
  )
}
