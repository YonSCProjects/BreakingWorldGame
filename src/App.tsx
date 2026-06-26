import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from './store/session'
import { ALL_MOLECULE_IDS } from './data/molecules'
import { useMagister } from './audio/useMagister'
import Background from './components/Background'
import ScanToast from './components/ScanToast'
import BootScreen from './screens/BootScreen'
import BriefingScreen from './screens/BriefingScreen'
import HuntScreen from './screens/HuntScreen'
import BondScreen from './screens/BondScreen'
import RevealScreen from './screens/RevealScreen'
import CodexScreen from './screens/CodexScreen'

export default function App() {
  useMagister() // the Magister speaks across the loop (no-op until audio unlocks)
  const phase = useSession((s) => s.phase)
  const hasBooted = useSession((s) => s.hasBooted)
  const lastScan = useSession((s) => s.lastScan)
  const codexCount = useSession((s) => s.session.codexMolecules.length)
  const resetSession = useSession((s) => s.resetSession)
  const [codexOpen, setCodexOpen] = useState(false)

  // The Unbinding recedes as the Codex fills — pristine void at 100%.
  const unbinding = Math.max(0.12, 0.7 - (codexCount / ALL_MOLECULE_IDS.length) * 0.6)
  const onBoot = phase === 'boot' && !hasBooted

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Background unbinding={onBoot ? 0.8 : unbinding} />

      {/* the active screen */}
      <main className="relative z-10 h-full w-full overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="min-h-full"
          >
            {phase === 'boot' && <BootScreen />}
            {phase === 'briefing' && <BriefingScreen />}
            {phase === 'hunt' && <HuntScreen />}
            {phase === 'bond' && <BondScreen />}
            {phase === 'reveal' && <RevealScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* in-world scan toasts */}
      <ScanToast scan={lastScan} />

      {/* persistent, subtle Codex control (hidden on boot) */}
      {hasBooted && phase !== 'reveal' && (
        <button
          onClick={() => setCodexOpen(true)}
          className="mono hud-frame fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-sm bg-void-900/70 px-3 py-2 text-[10px] tracking-[0.25em] text-signal/70 backdrop-blur active:text-signal"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          ◈ CODEX
          <span className="text-signal/40">{codexCount}/{ALL_MOLECULE_IDS.length}</span>
        </button>
      )}

      {/* Codex overlay */}
      <AnimatePresence>
        {codexOpen && <CodexScreen onClose={() => setCodexOpen(false)} />}
      </AnimatePresence>

      {/* tiny reset, only on the cold-open, for replays/testing */}
      {onBoot && (
        <button
          onClick={() => {
            if (confirm('Sever the channel and wipe this cell? This cannot be undone.')) resetSession()
          }}
          className="mono fixed bottom-3 left-1/2 z-50 -translate-x-1/2 text-[9px] tracking-[0.2em] text-signal/20 active:text-signal/60"
        >
          sever channel
        </button>
      )}
    </div>
  )
}
