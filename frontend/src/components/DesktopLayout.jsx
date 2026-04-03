import Terminal from './Terminal'
import ProfilePanel from './ProfilePanel'

export default function DesktopLayout() {
  return (
    <div
      className="fixed inset-0 flex flex-col lg:flex-row crt-flicker"
      style={{ background: 'var(--g-bg)' }}
    >
      {/* Left: Terminal */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0">
        <Terminal />
      </div>

      {/* Right: Profile sidebar */}
      <aside
        className="w-full lg:w-[340px] xl:w-[380px] shrink-0"
        style={{ borderLeft: '1px solid var(--g-ghost)' }}
      >
        <ProfilePanel />
      </aside>
    </div>
  )
}
