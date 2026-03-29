import { helpCommand }       from './help'
import { aboutCommand }      from './about'
import { projectsCommand }   from './projects'
import { experienceCommand } from './experience'
import { contactCommand }    from './contact'
import { CLEAR_COMMAND }     from './clear'

const registry = {
  help:       { handler: helpCommand,       desc: 'Show available commands' },
  about:      { handler: aboutCommand,      desc: 'Who is Vellow' },
  projects:   { handler: projectsCommand,   desc: 'Showcase of projects' },
  experience: { handler: experienceCommand, desc: 'Work & education' },
  contact:    { handler: contactCommand,    desc: 'Get in touch' },
}

export const COMMAND_NAMES = Object.keys(registry)

export function executeCommand(raw) {
  const input = raw.trim().toLowerCase()
  if (!input) return null
  if (input === 'clear') return CLEAR_COMMAND

  const cmd = registry[input]
  if (!cmd) {
    return (
      <span className="opacity-60">
        Command not found: <span className="text-glow">{input}</span>
        {'. Type '}
        <span className="text-glow">help</span>
        {' for available commands.'}
      </span>
    )
  }
  return cmd.handler()
}
