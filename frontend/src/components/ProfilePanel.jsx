import { useRef, useCallback } from 'react'
import { bio } from '../data/bio'

/* ── 3D Tilt Portrait Card ─────────────────── */
function TiltPortrait() {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)'
  }, [])

  const rows = [
    '0001111111100000',
    '0011111111111000',
    '0111001100011100',
    '0110011001101100',
    '0110110110101100',
    '0111000000011100',
    '0011001100111000',
    '0001111111100000',
    '0000111111000000',
    '0001111111100000',
    '0011011011110000',
    '0111000000011100',
    '0110000000001100',
    '0110000000001100',
    '0011000000011000',
    '0001111111100000',
  ]

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="tilt-card mx-auto mb-6 relative cursor-default"
      style={{
        width: '220px',
        height: '220px',
        border: '1px solid var(--g-dim)',
        background: 'linear-gradient(145deg, var(--g-surface) 0%, var(--g-bg) 100%)',
        padding: '16px',
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* Corner accents */}
      {[
        { top: '-1px', left: '-1px' },
        { top: '-1px', right: '-1px' },
        { bottom: '-1px', left: '-1px' },
        { bottom: '-1px', right: '-1px' },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            width: '8px',
            height: '8px',
            borderTop: pos.top ? '2px solid var(--g-primary)' : 'none',
            borderBottom: pos.bottom ? '2px solid var(--g-primary)' : 'none',
            borderLeft: pos.left ? '2px solid var(--g-primary)' : 'none',
            borderRight: pos.right ? '2px solid var(--g-primary)' : 'none',
          }}
        />
      ))}

      {/* Pixel dither grid */}
      <div
        className="tilt-card-inner w-full h-full flex flex-col items-center justify-center gap-px"
        style={{ opacity: 0.55 }}
      >
        {rows.map((row, r) => (
          <div key={r} className="flex gap-px">
            {row.split('').map((px, c) => (
              <div
                key={c}
                style={{
                  width: '8px',
                  height: '8px',
                  background: px === '1' ? 'var(--g-primary)' : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Label */}
      <div
        className="absolute bottom-0 left-0 right-0 text-center py-1"
        style={{
          background: 'rgba(8,9,12,0.9)',
          borderTop: '1px solid var(--g-ghost)',
          fontSize: '7px',
          color: 'var(--g-dim)',
          fontFamily: 'var(--font-pixel)',
          letterSpacing: '0.08em',
        }}
      >
        [ YOUR PORTRAIT ]
      </div>
    </div>
  )
}

export default function ProfilePanel() {
  return (
    <>
      {/* ── Mobile strip ───────────────────────── */}
      <div
        className="flex items-center gap-4 p-4 lg:hidden"
        style={{ borderBottom: '1px solid var(--g-ghost)' }}
      >
        <div
          className="w-14 h-14 shrink-0 flex items-center justify-center"
          style={{
            border: '1px solid var(--g-dim)',
            background: 'var(--g-surface)',
          }}
        >
          <span style={{ fontSize: '6px', color: 'var(--g-dim)', fontFamily: 'var(--font-pixel)' }}>
            IMG
          </span>
        </div>
        <div>
          <p
            className="glow-sm font-bold mb-1"
            style={{ fontSize: '11px', color: 'var(--g-bright)', fontFamily: 'var(--font-pixel)' }}
          >
            {bio.alias.toUpperCase()}
          </p>
          <p style={{ fontSize: '9px', color: 'var(--g-mid)', fontFamily: 'var(--font-pixel)' }}>
            {bio.title}
          </p>
        </div>
      </div>

      {/* ── Desktop full panel ──────────────────── */}
      <div
        className="hidden lg:flex flex-col h-full t-scroll"
        style={{
          fontFamily: 'var(--font-pixel)',
          padding: '32px 28px',
          background: 'var(--g-surface)',
        }}
      >
        {/* Portrait */}
        <TiltPortrait />

        {/* Alias */}
        <h1
          className="glow text-center mb-1"
          style={{ fontSize: '14px', color: 'var(--g-bright)', letterSpacing: '0.12em' }}
        >
          {bio.alias.toUpperCase()}
        </h1>

        {/* Real name */}
        <p
          className="text-center mb-1"
          style={{ fontSize: '9px', color: 'var(--g-mid)', fontFamily: 'var(--font-mono)' }}
        >
          {bio.name}
        </p>

        {/* Title */}
        <p
          className="glow-xs text-center mb-6"
          style={{ fontSize: '9px', color: 'var(--g-mid)', letterSpacing: '0.1em' }}
        >
          {bio.title}
        </p>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--g-dim), transparent)',
            marginBottom: '20px',
          }}
        />

        {/* About text */}
        <p
          className="text-center mb-6"
          style={{
            fontSize: '10px',
            color: 'var(--g-mid)',
            lineHeight: '2.2',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {bio.intro}
        </p>

        {/* Stack tags */}
        <p
          className="glow-xs mb-3"
          style={{ fontSize: '9px', color: 'var(--g-mid)', letterSpacing: '0.1em' }}
        >
          STACK//
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {bio.skills.slice(0, 6).map(s => (
            <span
              key={s}
              style={{
                fontSize: '8px',
                color: 'var(--g-primary)',
                padding: '4px 8px',
                border: '1px solid var(--g-dim)',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bottom divider */}
        <div
          className="mt-auto"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--g-dim), transparent)',
            marginBottom: '16px',
          }}
        />

        {/* Help hint */}
        <p
          className="text-center"
          style={{ fontSize: '8px', color: 'var(--g-dim)' }}
        >
          type{' '}
          <span className="glow-xs" style={{ color: 'var(--g-primary)' }}>help</span>
          {' '}to explore
        </p>
      </div>
    </>
  )
}
