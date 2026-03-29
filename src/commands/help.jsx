const COMMANDS = [
  { name: 'about',      desc: 'Who is Vellow' },
  { name: 'projects',   desc: 'Showcase of projects' },
  { name: 'experience', desc: 'Work & education' },
  { name: 'contact',    desc: 'Get in touch' },
  { name: 'clear',      desc: 'Clear the terminal' },
  { name: 'help',       desc: 'Show this message' },
]

export function helpCommand() {
  return (
    <div className="my-1">
      <p className="mb-2">Available commands:</p>
      <div className="ml-2">
        {COMMANDS.map(c => (
          <p key={c.name} className="leading-loose">
            <span className="mr-3">{'>'}</span>
            <span className="mr-4">{c.name.padEnd(12)}</span>
            <span className="opacity-60">{c.desc}</span>
          </p>
        ))}
      </div>
    </div>
  )
}
