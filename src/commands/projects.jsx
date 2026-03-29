import { projects } from '../data/projects'

export function projectsCommand() {
  return (
    <div className="my-1 leading-loose">
      <p className="mb-2">{'── PROJECTS ──────────────────────────────'}</p>
      {projects.map((p, i) => (
        <div key={i} className="mb-4 ml-2 pixel-border p-3">
          <p className="text-glow mb-1">{p.title}</p>
          <p className="opacity-60 text-[10px] mb-2 leading-relaxed">{p.description}</p>
          <p className="opacity-50 text-[9px] mb-2">
            {p.stack.join(' · ')}
          </p>
          <div className="flex gap-4 text-[10px]">
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-glow"
              >
                [GitHub]
              </a>
            )}
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-glow"
              >
                [Live]
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
