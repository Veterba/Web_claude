const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/vellow',              display: 'github.com/vellow' },
  { label: 'Email',    href: 'mailto:vellow@example.com',              display: 'vellow@example.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yaroslav-zasinets', display: 'linkedin.com/in/vellow' },
]

export function contactCommand() {
  return (
    <div className="my-1 leading-loose">
      <p className="mb-2">{'── CONTACT ───────────────────────────────'}</p>
      {LINKS.map(l => (
        <p key={l.label} className="ml-2">
          <span className="opacity-50 mr-3">{l.label.padEnd(10)}</span>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-glow"
          >
            {l.display}
          </a>
        </p>
      ))}
    </div>
  )
}
