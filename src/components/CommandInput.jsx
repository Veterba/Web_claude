import { useRef, useEffect, useState } from 'react'
import { COMMAND_NAMES } from '../commands/index'

export default function CommandInput({ onSubmit }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = value.trim()
      if (cmd) {
        onSubmit(cmd)
        setValue('')
      }
    }
  }

  const injectCommand = (cmd) => {
    onSubmit(cmd)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div>
      {/* Mobile command pills */}
      <div className="flex flex-wrap gap-2 mb-3 sm:hidden">
        {COMMAND_NAMES.map(name => (
          <button
            key={name}
            onClick={() => injectCommand(name)}
            className="pixel-border px-2 py-1 text-white text-[6px] hover:bg-white hover:text-black transition-colors"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Prompt line */}
      <div
        className="flex items-center gap-0 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="text-glow shrink-0 mr-2 text-[8px] sm:text-[10px]">
          vellow@portfolio:~$
        </span>
        <div className="flex items-center flex-1 relative min-w-0">
          <input
            ref={inputRef}
            type="text"
            className="ghost-input text-[8px] sm:text-[10px]"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          <span className="cursor shrink-0" />
        </div>
      </div>
    </div>
  )
}
