import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from './store/session'
import { useRoom } from './net/roomClient'
import { ALL_MOLECULE_IDS } from './data/molecules'
import Background from './components/Background'
import ScanToast from './components/ScanToast'
import BootScreen from './screens/BootScreen'
import BriefingScreen from './screens/BriefingScreen'
import HuntScreen from './screens/HuntScreen'
import BondScreen from './screens/BondScreen'
import RevealScreen from './screens/RevealScreen'
import CodexScreen from './screens/CodexScreen'
import EntryScreen from './screens/EntryScreen'
import JoinScreen from './screens/JoinScreen'
import ControlDashboard from './screens/ControlDashboard'
import ManagerPortal from './screens/ManagerPortal'
import FieldBridge from './net/FieldBridge'
import { teamByName } from './data/teams'

type Choice = 'solo' | 'field' | 'control'

export default function App() {
  const phase = useSession((s) => s.phase)
  const hasBooted = useSession((s) => s.hasBooted)
  const mode = useSession((s) => s.mode)
  const lastScan = useSession((s) => s.lastScan)
  const codexCount = useSession((s) => s.session.codexMolecules.length)
  const resetSession = useSession((s) => s.resetSession)
  const setMode = useSession((s) => s.setMode)
  const goto = useSession((s) => s.goto)

  const role = useRoom((s) => s.role)
  const join = useRoom((s) => s.join)
  const leaveRoom = useRoom((s) => s.leave)

  const [codexOpen, setCodexOpen] = useState(false)
  const [chose, setChose] = useState<Choice | null>(null)
  // ?manage opens the staff ceremony/roster portal (read once at load).
  const [manage] = useState(
    () => typeof location !== 'undefined' && new URLSearchParams(location.search).has('manage'),
  )

  // Badge deep-link: ?team=EAGLE&role=field|control drops a phone straight into
  // its Order + station — no menus to argue over.
  useEffect(() => {
    if (manage) return
    const p = new URLSearchParams(location.search)
    const team = teamByName(p.get('team'))
    const r = p.get('role')
    if (team && (r === 'field' || r === 'control')) {
      if (r === 'field') {
        setMode('field')
        goto('briefing')
      }
      join(team.name, r, team.name)
      setChose(r)
      history.replaceState(null, '', location.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The Unbinding recedes as the Codex fills.
  const unbinding = Math.max(0.12, 0.7 - (codexCount / ALL_MOLECULE_IDS.length) * 0.6)

  // ── route resolution ──────────────────────────────────────────────────
  const route =
    role === 'control'
      ? 'control'
      : role === 'field'
        ? 'field'
        : chose === 'field'
          ? 'join-field'
          : chose === 'control'
            ? 'join-control'
            : chose === 'solo'
              ? 'solo'
              : mode === 'solo' && hasBooted
                ? 'solo'
                : 'entry'

  const backToEntry = () => {
    leaveRoom()
    setChose(null)
  }

  const onBootScreen = route === 'solo' && phase === 'boot' && !hasBooted

  // staff ceremony/roster portal takes over the whole screen
  if (manage) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <Background unbinding={0.35} particleColor="#8b7bff" />
        <main className="relative z-10 h-full w-full overflow-y-auto no-scrollbar">
          <ManagerPortal
            onExit={() => {
              history.replaceState(null, '', location.pathname)
              location.reload()
            }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Background
        unbinding={route === 'entry' || onBootScreen ? 0.8 : unbinding}
        particleColor={route === 'control' ? '#8b7bff' : '#5ef2ff'}
      />

      {/* networked field devices keep the local view-model synced to the room */}
      {route === 'field' && <FieldBridge />}

      <main className="relative z-10 h-full w-full overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={route === 'solo' || route === 'field' ? `game-${phase}` : route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-full"
          >
            {route === 'entry' && (
              <EntryScreen
                onChoose={(c) => {
                  if (c === 'solo') setMode('solo')
                  setChose(c)
                }}
              />
            )}
            {route === 'join-field' && <JoinScreen role="field" onBack={() => setChose(null)} />}
            {route === 'join-control' && <JoinScreen role="control" onBack={() => setChose(null)} />}
            {route === 'control' && <ControlDashboard onLeave={backToEntry} />}

            {(route === 'solo' || route === 'field') && (
              <>
                {phase === 'boot' && route === 'solo' && <BootScreen />}
                {phase === 'briefing' && <BriefingScreen />}
                {phase === 'hunt' && <HuntScreen />}
                {phase === 'bond' && <BondScreen />}
                {phase === 'reveal' && <RevealScreen />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* in-world scan toasts (solo + field) */}
      {(route === 'solo' || route === 'field') && <ScanToast scan={lastScan} />}

      {/* field: incoming hints + connection status */}
      {route === 'field' && <FieldOverlays />}

      {/* persistent, subtle Codex control during a game */}
      {(route === 'solo' || route === 'field') && hasBooted && phase !== 'reveal' && (
        <button
          onClick={() => setCodexOpen(true)}
          className="mono hud-frame fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-sm bg-void-900/70 px-3 py-2 text-[10px] tracking-[0.25em] text-signal/70 backdrop-blur active:text-signal"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          ◈ CODEX
          <span className="text-signal/40">
            {codexCount}/{ALL_MOLECULE_IDS.length}
          </span>
        </button>
      )}

      <AnimatePresence>{codexOpen && <CodexScreen onClose={() => setCodexOpen(false)} />}</AnimatePresence>

      {/* leave / sever controls */}
      {route === 'field' && phase === 'briefing' && (
        <button
          onClick={backToEntry}
          className="mono fixed bottom-4 left-4 z-50 text-[9px] tracking-[0.2em] text-signal/25 active:text-signal/60"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          ▸ leave team
        </button>
      )}
      {onBootScreen && (
        <button
          onClick={() => setChose(null)}
          className="mono fixed left-4 top-4 z-50 text-[10px] tracking-[0.2em] text-signal/30 active:text-signal/70"
        >
          ‹ stations
        </button>
      )}
      {route === 'solo' && hasBooted && phase === 'briefing' && (
        <button
          onClick={() => {
            if (confirm('Sever the channel and wipe this cell? This cannot be undone.')) resetSession()
          }}
          className="mono fixed bottom-4 left-4 z-50 text-[9px] tracking-[0.2em] text-signal/25 active:text-signal/60"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          ▸ sever channel
        </button>
      )}
    </div>
  )
}

// Field-only: surfaces incoming control-room hints as Lattice transmissions
// and shows a quiet banner if the channel drops.
function FieldOverlays() {
  const status = useRoom((s) => s.status)
  const lastHint = useRoom((s) => s.lastHint)
  const [hint, setHint] = useState<string | null>(null)
  const hintTs = useRef(0)

  useEffect(() => {
    if (lastHint && lastHint.ts !== hintTs.current) {
      hintTs.current = lastHint.ts
      setHint(lastHint.text)
      const t = setTimeout(() => setHint(null), 8000)
      return () => clearTimeout(t)
    }
  }, [lastHint])

  return (
    <>
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            className="pointer-events-none fixed inset-x-0 bottom-20 z-50 mx-auto w-[88%] max-w-md"
            onClick={() => setHint(null)}
          >
            <div className="hud-frame rounded-sm bg-void-900/85 px-4 py-3 text-center backdrop-blur-md"
              style={{ borderColor: 'rgba(139,123,255,0.5)' }}>
              <p className="mono text-[9px] tracking-[0.3em] text-lattice/70">◈ CONTROL ROOM</p>
              <p className="mono mt-1 text-[12px] leading-relaxed text-[#d7c8ff]/90">{hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {status !== 'open' && (
        <div className="mono fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-sm border border-warn/40 bg-void-900/80 px-3 py-1 text-[9px] tracking-[0.2em] text-warn/90 backdrop-blur">
          {status === 'reconnecting' ? '◴ RE-LINKING…' : '◴ LINKING…'}
        </div>
      )}
    </>
  )
}
