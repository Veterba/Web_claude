import { experience } from '../data/experience'

export function experienceCommand() {
  return (
    <div className="my-1 leading-loose">
      <p className="mb-2">{'── EXPERIENCE ────────────────────────────'}</p>
      {experience.map((e, i) => (
        <div key={i} className="mb-4 ml-2">
          <p className="opacity-50 text-[10px]">[{e.year}]</p>
          <p className="ml-2 leading-tight">
            {'├─ '}<span className="text-glow">{e.role}</span>
          </p>
          <p className="ml-2">{'│   @ '}{e.org}</p>
          <p className="ml-2 opacity-50 text-[10px]">{'└─ '}{e.description}</p>
        </div>
      ))}
    </div>
  )
}
