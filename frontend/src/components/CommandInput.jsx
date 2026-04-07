import { useRef, useEffect, useState } from 'react'
import { COMMAND_NAMES } from '../commands/index'

export default function CommandInput({ onSubmit }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = value.trim()
      if (cmd) { onSubmit(cmd); setValue('') }
    }
  }

  const injectCommand = (cmd) => {
    onSubmit(cmd)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div>
      {/* Command pills — visible on all sizes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {COMMAND_NAMES.map(name => (
          <button
            key={name}
            data-cmd={name}
            onClick={() => injectCommand(name)}
            className="cmd-pill"
            style={{ fontSize: '9px', letterSpacing: '0.06em' }}
          >
            [{name}]
          </button>
        ))}
      </div>

      {/* Prompt line */}
      <div
        className="flex items-center cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <span
          className="glow-xs shrink-0 mr-2"
          style={{ fontSize: '12px', color: 'var(--g-mid)' }}
        >
          vellow@portfolio:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          className="ghost-input"
          style={{ fontSize: '12px', width: value.length ? `${value.length + 1}ch` : '0' }}
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
  )
}
