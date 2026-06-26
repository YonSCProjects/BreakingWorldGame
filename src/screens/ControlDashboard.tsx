import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRoom } from '../net/roomClient'
import { MISSIONS } from '../data/missions'
import { MOLECULES } from '../data/molecules'
import { ELEMENTS } from '../data/elements'
import { trayCounts } from '../store/verify'
import AtomGlyph from '../components/AtomGlyph'
import MoleculeView3D from '../components/MoleculeView3D'
import { formulaLabel } from '../utils/format'
import { hapticMedium } from '../utils/haptics'

// The watch station. Mirrors the team's live progress, renders the target
// lattice in 3D, lets the control player transmit hints, and (as a backup to
// the field phone's ritual) confirm the bond.
export default function ControlDashboard({ onLeave }: { onLeave: () => void }) {
  const status = useRoom((s) => s.status)
  const code = useRoom((s) => s.code)
  const state = useRoom((s) => s.state)
  const lastSealed = useRoom((s) => s.lastSealed)
  const sendHint = useRoom((s) => s.sendHint)
  const staffConfirm = useRoom((s) => s.staffConfirm)
  const resetTeam = useRoom((s) => s.resetTeam)

  const [draft, setDraft] = useState('')
  const [sealBanner, setSealBanner] = useState<string | null>(null)
  const sealTs = useRef(0)

  // celebrate when a molecule seals
  useEffect(() => {
    if (lastSealed && lastSealed.ts !== sealTs.current) {
      sealTs.current = lastSealed.ts
      setSealBanner(lastSealed.moleculeId)
      const t = setTimeout(() => setSealBanner(null), 3200)
      return () => clearTimeout(t)
    }
  }, [lastSealed])

  const mission = state ? MISSIONS[state.currentMissionIndex] : undefined
  const molecule = mission ? MOLECULES[mission.targetMoleculeId] : undefined
  const filled = useMemo(() => (state ? trayCounts(state.tray) : {}), [state])

  if (status !== 'open' || !state) {
    return (
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="mono soft-pulse text-sm tracking-[0.3em] text-signal/80">
          {status === 'reconnecting' ? 'RE-ESTABLISHING CHANNEL…' : 'OPENING CHANNEL…'}
        </p>
        <p className="mono text-[11px] tracking-[0.2em] text-signal/40">CELL · {code}</p>
        <button className="btn-ghost mt-4 text-xs" onClick={onLeave}>
          Abort
        </button>
      </div>
    )
  }

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    hapticMedium()
    sendHint(t)
    setDraft('')
  }

  const presets = [
    mission?.clueText ? { label: '↻ Relay the clue', text: mission.clueText } : null,
    { label: 'You have enough — assemble', text: 'You already hold what you need. Bring the atoms together.' },
    { label: 'A sealed one won’t bond', text: 'One of those is sealed and will never bond — find another.' },
    { label: 'Search the changed places', text: 'Look where the world feels changed — heat, water, ash.' },
  ].filter(Boolean) as { label: string; text: string }[]

  return (
    <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col gap-4 px-5 py-6">
      {/* header */}
      <header className="flex items-center justify-between border-b border-signal/20 pb-3">
        <div className="flex items-center gap-4">
          <span className="mono text-sm uppercase tracking-[0.3em] text-signal text-glow">◎ CONTROL · {state.cellName || code}</span>
          <Presence field={state.presence.field} control={state.presence.control} />
        </div>
        <div className="flex items-center gap-4">
          <button
            className="mono text-[10px] tracking-[0.25em] text-warn/50 active:text-warn"
            onClick={() => {
              if (confirm(`Reset team ${state.cellName || code} back to the first mission? This wipes their progress for everyone.`)) {
                resetTeam()
              }
            }}
          >
            ↺ reset team
          </button>
          <button className="mono text-[10px] tracking-[0.25em] text-signal/35 active:text-signal/70" onClick={onLeave}>
            ▸ leave
          </button>
        </div>
      </header>

      {!mission || !molecule ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="mono text-base tracking-[0.2em] text-signal text-glow">CELL COMPLETE</p>
          <p className="mono text-xs text-[#bfefff]/70">Every lattice in this descent is stabilized. Hold the line.</p>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2">
          {/* left: target + 3D + progress */}
          <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="mono text-[10px] tracking-[0.3em] text-signal/55">
                ACT {mission.act} · TARGET {String(mission.order).padStart(2, '0')}
              </span>
              <span className="mono text-xs uppercase tracking-[0.2em] text-signal text-glow">
                {molecule.displayName} · {formulaLabel(molecule.formula)}
              </span>
            </div>

            <div className="hud-frame relative rounded-sm bg-void-900/40" style={{ height: 280 }}>
              <MoleculeView3D moleculeId={molecule.id} filled={filled} />
              <span className="mono pointer-events-none absolute bottom-2 left-2 text-[9px] tracking-[0.2em] text-signal/30">
                ◈ LIVE LATTICE · drag to rotate
              </span>
              {state.ready && (
                <span className="mono soft-pulse absolute right-2 top-2 rounded-sm border border-signal/50 px-2 py-1 text-[10px] tracking-[0.2em] text-signal text-glow">
                  SET COMPLETE
                </span>
              )}
            </div>

            {/* gathered atoms */}
            <div className="hud-frame rounded-sm bg-void-900/40 p-3">
              <p className="mono mb-2 text-[10px] tracking-[0.3em] text-signal/50">GATHERED</p>
              <div className="flex min-h-[54px] flex-wrap items-center gap-1">
                {state.tray.length === 0 && (
                  <span className="mono text-[10px] tracking-[0.2em] text-signal/30">— nothing in the field yet —</span>
                )}
                {state.tray.map((a, i) => (
                  <AtomGlyph key={a.cardId + i} symbol={a.element} size={34} idle={false} />
                ))}
              </div>
              <div className="mono mt-2 flex flex-wrap gap-3 text-[10px] tracking-[0.2em] text-signal/60">
                {Object.entries(molecule.formula).map(([sym, n]) => (
                  <span key={sym} style={{ color: ELEMENTS[sym]?.color }}>
                    {sym} {filled[sym] ?? 0}/{n}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* right: hints + seal */}
          <section className="flex flex-col gap-3">
            <div className="hud-frame flex flex-col gap-2 rounded-sm bg-void-900/40 p-3">
              <p className="mono text-[10px] tracking-[0.3em] text-signal/50">TRANSMIT HINT</p>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => send(p.text)}
                    className="mono rounded-sm border border-signal/25 px-2 py-1 text-[10px] tracking-[0.1em] text-signal/80 active:bg-signal/10"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-1 flex gap-2">
                <input
                  className="field-signal flex-1 px-3 py-2 text-left text-xs tracking-normal"
                  style={{ textAlign: 'left', textTransform: 'none', letterSpacing: 'normal' }}
                  placeholder="Type a transmission to the field…"
                  value={draft}
                  maxLength={240}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send(draft)}
                />
                <button className="btn-ghost text-xs" onClick={() => send(draft)}>
                  Send
                </button>
              </div>
            </div>

            {/* hint log */}
            <div className="hud-frame flex-1 overflow-y-auto no-scrollbar rounded-sm bg-void-900/40 p-3">
              <p className="mono mb-2 text-[10px] tracking-[0.3em] text-signal/50">TRANSMISSION LOG</p>
              <div className="flex flex-col gap-2">
                {state.hints.length === 0 && (
                  <span className="mono text-[10px] tracking-[0.2em] text-signal/30">— no transmissions sent —</span>
                )}
                {[...state.hints].reverse().map((h, i) => (
                  <p key={i} className="mono border-l-2 border-lattice/40 pl-2 text-[11px] leading-relaxed text-[#d7c8ff]/80">
                    {h.text}
                  </p>
                ))}
              </div>
            </div>

            {/* seal */}
            <button
              className="btn-signal w-full text-sm disabled:opacity-40"
              disabled={!state.ready}
              onClick={() => {
                hapticMedium()
                staffConfirm()
              }}
            >
              {state.ready ? '⟡ Confirm Bond' : 'Awaiting the full set…'}
            </button>
          </section>
        </div>
      )}

      {/* seal celebration */}
      <AnimatePresence>
        {sealBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="hud-frame rounded-sm bg-void-900/90 px-8 py-6 text-center"
            >
              <p className="mono text-[10px] tracking-[0.35em] text-signal/60">⟡ STABILIZED ⟡</p>
              <p className="mono mt-1 text-xl uppercase tracking-[0.2em] text-signal text-glow">
                {MOLECULES[sealBanner]?.displayName}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Presence({ field, control }: { field: number; control: number }) {
  return (
    <span className="mono flex items-center gap-3 text-[10px] tracking-[0.2em] text-signal/50">
      <span className={field > 0 ? 'text-signal' : 'text-warn/70'}>⌖ {field} field</span>
      <span className={control > 0 ? 'text-signal' : 'text-signal/40'}>◎ {control} control</span>
    </span>
  )
}
