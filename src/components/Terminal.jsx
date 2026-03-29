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
    // Echo what user typed
    setHistory(h => [...h, { id: uid(), type: 'input', text: raw }])

    const result = executeCommand(raw)
    if (result === null) return
    if (result === CLEAR_COMMAND) {
      setHistory([])
      return
    }
    pushOutput(result)
  }

  // Auto-run help on mount
  useEffect(() => {
    const result = executeCommand('help')
    if (result) pushOutput(result)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // Refocus input on click anywhere in terminal
  const refocusInput = (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      containerRef.current?.querySelector('input')?.focus()
    }
  }

  return (
    <div
      ref={containerRef}
      className="crt-flicker fixed inset-0 bg-black flex flex-col"
      onClick={refocusInput}
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white px-4 py-2 shrink-0">
        <span className="text-[7px] sm:text-[9px] text-glow">VELLOW_OS v1.0</span>
        <span className="text-[6px] opacity-40">
          {COMMAND_NAMES.join(' / ')}
        </span>
      </div>

      {/* History */}
      <div
        className="terminal-scroll flex-1 px-4 py-3"
        aria-live="polite"
        aria-atomic="false"
      >
        {history.map(entry => (
          <div key={entry.id} className="mb-1">
            {entry.type === 'input' ? (
              <p className="text-[8px] sm:text-[10px] text-glow">
                <span className="opacity-50 mr-2">vellow@portfolio:~$</span>
                {entry.text}
              </p>
            ) : (
              <div className="text-[8px] sm:text-[10px] ml-0 leading-loose">
                {entry.content}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white px-4 py-3 shrink-0">
        <CommandInput onSubmit={handleCommand} />
      </div>
    </div>
  )
}
