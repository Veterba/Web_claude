import { bio } from '../data/bio'

/* Pixel dithering pattern — simulates a placeholder portrait */
function PixelPortrait() {
  // 16×16 dither grid, 1=lit pixel
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
      className="portrait-box mx-auto mb-6 border relative"
      style={{
        width: '220px',
        height: '220px',
        borderColor: 'var(--g-mid)',
        borderWidth: '2px',
        background: 'var(--g-ghost)',
        padding: '16px',
      }}
    >
      {/* Corner decorations */}
      {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map(pos => (
        <div
          key={pos}
          className={`absolute ${pos} w-2 h-2`}
          style={{ background: 'var(--g-mid)' }}
        />
      ))}

      {/* Pixel dither grid */}
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-px"
        style={{ opacity: 0.5 }}
      >
        {rows.map((row, r) => (
          <div key={r} className="flex gap-px">
            {row.split('').map((px, c) => (
              <div
                key={c}
                style={{
                  width: '8px',
                  height: '8px',
                  background: px === '1' ? 'var(--g-mid)' : 'transparent',
                  boxShadow: px === '1' ? '0 0 2px var(--g-dim)' : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Replace label */}
      <div
        className="absolute bottom-0 left-0 right-0 text-center py-1"
        style={{
          background: 'rgba(6,12,5,0.85)',
          borderTop: '1px solid var(--g-ghost)',
          fontSize: '7px',
          color: 'var(--g-dim)',
          fontFamily: 'var(--font-pixel)',
          letterSpacing: '0.05em',
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
            border: '2px solid var(--g-mid)',
            background: 'var(--g-ghost)',
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
        className="hidden lg:flex flex-col h-full t-scroll scan-divider"
        style={{
          fontFamily: 'var(--font-pixel)',
          padding: '32px 28px',
          background: `linear-gradient(180deg, rgba(57,255,20,0.025) 0%, transparent 40%)`,
        }}
      >
        {/* Portrait */}
        <PixelPortrait />

        {/* Alias */}
        <h1
          className="glow text-center mb-1"
          style={{ fontSize: '14px', color: 'var(--g-bright)', letterSpacing: '0.1em' }}
        >
          {bio.alias.toUpperCase()}
        </h1>

        {/* Real name */}
        <p
          className="text-center mb-1"
          style={{ fontSize: '9px', color: 'var(--g-mid)' }}
        >
          {bio.name}
        </p>

        {/* Title */}
        <p
          className="glow-xs text-center mb-6"
          style={{ fontSize: '9px', color: 'var(--g-dim)' }}
        >
          ── {bio.title} ──
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
            lineHeight: '2',
          }}
        >
          {bio.intro}
        </p>

        {/* Stack tags */}
        <p
          className="glow-xs mb-3"
          style={{ fontSize: '9px', color: 'var(--g-dim)' }}
        >
          STACK//
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {bio.skills.slice(0, 6).map(s => (
            <span
              key={s}
              style={{
                fontSize: '8px',
                color: 'var(--g-mid)',
                padding: '3px 7px',
                border: '1px solid var(--g-ghost)',
                letterSpacing: '0.05em',
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Divider */}
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
