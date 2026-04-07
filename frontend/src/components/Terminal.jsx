import { useState, useEffect, useRef } from 'react'
import CommandInput from './CommandInput'
import { executeCommand, COMMAND_NAMES } from '../commands/index'
import { CLEAR_COMMAND } from '../commands/clear'

let idCounter = 0
function uid() { return ++idCounter }

export default function Terminal() {
  const [history, setHistory] = useState([])
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  const pushOutput = (content) => {
    setHistory(h => [...h, { id: uid(), type: 'output', content }])
  }

  const handleCommand = (raw) => {
    setHistory(h => [...h, { id: uid(), type: 'input', text: raw }])
    const result = executeCommand(raw)
    if (result === null) return
    if (result === CLEAR_COMMAND) {
      const helpResult = executeCommand('help')
      setHistory(helpResult ? [{ id: uid(), type: 'output', content: helpResult }] : [])
      return
    }
    pushOutput(result)
  }

  useEffect(() => {
    const result = executeCommand('help')
    if (result) pushOutput(result)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const refocusInput = (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      containerRef.current?.querySelector('input')?.focus()
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full min-h-0"
      onClick={refocusInput}
      style={{ fontFamily: 'var(--font-pixel)', background: 'var(--g-bg)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--g-ghost)' }}
      >
        <div className="flex items-center gap-3">
          {/* Status dot */}
          <div
            style={{
              width: '6px',
              height: '6px',
              background: 'var(--g-primary)',
              boxShadow: '0 0 6px var(--g-primary)',
              borderRadius: '50%',
            }}
          />
          <span
            className="glow-sm"
            style={{ fontSize: '11px', color: 'var(--g-bright)', letterSpacing: '0.08em' }}
          >
            VELLOW_OS
          </span>
          <span style={{ fontSize: '9px', color: 'var(--g-dim)' }}>v1.0</span>
        </div>
      </div>

      {/* History */}
      <div
        className="t-scroll flex-1 min-h-0 px-5 py-4"
        aria-live="polite"
        aria-atomic="false"
      >
        {history.map(entry => (
          <div key={entry.id} className="mb-2">
            {entry.type === 'input' ? (
              <p
                className="glow-xs"
                style={{ fontSize: '12px', color: 'var(--g-bright)', lineHeight: '1.6' }}
              >
                <span style={{ color: 'var(--g-dim)', marginRight: '8px' }}>
                  vellow@portfolio:~$
                </span>
                {entry.text}
              </p>
            ) : (
              <div
                style={{ fontSize: '12px', lineHeight: '1.8', color: 'var(--g-primary)' }}
              >
                {entry.content}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="px-5 py-4 shrink-0"
        style={{ borderTop: '1px solid var(--g-ghost)' }}
      >
        <CommandInput onSubmit={handleCommand} />
      </div>
    </div>
  )
}
