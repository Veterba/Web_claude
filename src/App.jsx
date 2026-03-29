import { useState, useCallback } from 'react'
import BootScreen from './components/BootScreen'
import Terminal from './components/Terminal'
import CrtOverlay from './components/CrtOverlay'

const SKIP_KEY = 'vellow_boot_done'

function App() {
  const alreadyBooted = sessionStorage.getItem(SKIP_KEY) === '1'
  const [phase, setPhase] = useState(alreadyBooted ? 'terminal' : 'boot')

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem(SKIP_KEY, '1')
    setPhase('terminal')
  }, [])

  return (
    <main>
      <CrtOverlay />
      {phase === 'boot'
        ? <BootScreen onComplete={handleBootComplete} />
        : <Terminal />
      }
    </main>
  )
}

export default App
