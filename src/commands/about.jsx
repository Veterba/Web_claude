import { bio } from '../data/bio'

export function aboutCommand() {
  return (
    <div className="my-1 leading-loose">
      <p>{'┌─ ABOUT ─────────────────────────────┐'}</p>
      <p>{'│'}</p>
      <p>{'│  '}<span className="text-glow font-bold">{bio.alias}</span><span className="opacity-50 text-[10px]">  ({bio.name})</span></p>
      <p>{'│  '}{bio.title}</p>
      <p>{'│  '}<span className="opacity-60 text-[10px]">{bio.intro}</span></p>
      <p>{'│'}</p>
      <p>{'│  SKILLS'}</p>
      {bio.skills.map((s, i) => (
        <p key={i}>{'│    > '}{s}</p>
      ))}
      <p>{'│'}</p>
      <p>{'│  TOOLS'}</p>
      {bio.tools.map((t, i) => (
        <p key={i}>{'│    > '}{t}</p>
      ))}
      <p>{'│'}</p>
      <p>{'│  LANGUAGES'}</p>
      {bio.languages.map((l, i) => (
        <p key={i}>{'│    > '}{l.name}<span className="opacity-50"> [{l.level}]</span></p>
      ))}
      <p>{'│'}</p>
      <p>{'└────────────────────────────────────┘'}</p>
    </div>
  )
}
