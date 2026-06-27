import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from '../store/session'
import { useRoom } from '../net/roomClient'
import { MISSIONS } from '../data/missions'
import { MOLECULES } from '../data/molecules'
import { ELEMENTS } from '../data/elements'
import { isFormulaComplete } from '../store/verify'
import Scanner from '../components/Scanner'
import AtomGlyph from '../components/AtomGlyph'
import { hapticLight, hapticReject, hapticMedium } from '../utils/haptics'
import { formulaLabel } from '../utils/format'
import { STAFF_MODE } from '../utils/staff'

export default function HuntScreen() {
  const idx = useSession((s) => s.session.currentMissionIndex)
  const tray = useSession((s) => s.session.tray)
  const claimCard = useSession((s) => s.claimCard)
  const goto = useSession((s) => s.goto)
  const mode = useSession((s) => s.mode)
  const lastScan = useSession((s) => s.lastScan)
  const netScan = useRoom((s) => s.scan)

  const mission = MISSIONS[idx]
  const molecule = mission ? MOLECULES[mission.targetMoleculeId] : undefined

  const [burst, setBurst] = useState<{ color: string; ts: number } | null>(null)
  const [showSim, setShowSim] = useState(false)
  const busyRef = useRef(false)

  const ready = molecule ? isFormulaComplete(tray, molecule) : false

  // central claim handler shared by camera + simulate injector. In field mode
  // the scan goes to the team room; the outcome (and FX) come back via lastScan.
  const handleScan = (raw: string) => {
    if (busyRef.current) return
    busyRef.current = true
    if (mode === 'field') netScan(raw)
    else claimCard(raw)
    // brief lock so a held QR can't double-fire through our own handler
    window.setTimeout(() => {
      busyRef.current = false
    }, 700)
  }

  // Drive materialize burst + haptics off the latest scan outcome — unified for
  // solo (claimCard set it) and field (the room bridge set it).
  const fxTs = useRef(0)
  useEffect(() => {
    if (!lastScan || lastScan.ts === fxTs.current) return
    fxTs.current = lastScan.ts
    if (lastScan.kind === 'accepted') {
      setBurst({ color: ELEMENTS[lastScan.element]?.color ?? '#5ef2ff', ts: lastScan.ts })
      hapticLight()
    } else {
      hapticReject()
    }
  }, [lastScan])

  if (!mission || !molecule) return null

  return (
    <div className="relative z-10 flex min-h-full flex-col">
      {/* ── live camera fills the screen ─────────────────────────────── */}
      <div className="relative flex-1">
        <Scanner active onResult={handleScan} />

        {/* reticle */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-56 w-56">
            <Corner className="left-0 top-0 border-l-2 border-t-2" />
            <Corner className="right-0 top-0 border-r-2 border-t-2" />
            <Corner className="bottom-0 left-0 border-b-2 border-l-2" />
            <Corner className="bottom-0 right-0 border-b-2 border-r-2" />
            <div className="absolute inset-x-0 top-0 h-[2px] animate-scanline bg-signal/60 shadow-[0_0_12px_#5ef2ff]" />
          </div>
        </div>

        {/* mission target prompt, top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-1 pt-5">
          <span className="mono text-[10px] tracking-[0.3em] text-signal/60">
            ◈ SENSOR FIELD · ACT {mission.act}
          </span>
          <span className="mono text-xs uppercase tracking-[0.2em] text-signal text-glow">
            seeking {molecule.displayName} · {formulaLabel(molecule.formula)}
          </span>
        </div>

        {/* materialize burst */}
        <AnimatePresence>
          {burst && (
            <motion.div
              key={burst.ts}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              onAnimationComplete={() => setBurst(null)}
            >
              <div
                className="h-40 w-40 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${burst.color} 0%, transparent 70%)`,
                  filter: 'blur(8px)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── the holding field along the bottom ───────────────────────── */}
      <div className="relative z-10 border-t border-signal/20 bg-void-900/85 px-4 pb-5 pt-4 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="mono text-[10px] tracking-[0.3em] text-signal/60">
            HOLDING FIELD
          </span>
          {/* staff-only: hidden for players so the physical hunt can't be skipped */}
          {STAFF_MODE && (
            <button
              className="mono text-[10px] tracking-[0.2em] text-signal/35 active:text-signal"
              onClick={() => setShowSim((v) => !v)}
            >
              ◇ STAFF INJECTOR
            </button>
          )}
        </div>

        <HoldingField molecule={molecule} tray={tray} />

        {/* simulate / test injector — staff-only stand-in for a printed QR */}
        <AnimatePresence>
          {STAFF_MODE && showSim && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <SimInjector onInject={handleScan} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ready → forge */}
        <AnimatePresence>
          {ready && (
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="btn-signal mt-4 w-full soft-pulse text-sm"
              onClick={() => {
                hapticMedium()
                goto('bond')
              }}
            >
              The set is whole · Forge the bond
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function HoldingField({
  molecule,
  tray,
}: {
  molecule: { formula: Record<string, number> }
  tray: { cardId: string; element: string }[]
}) {
  // Build ordered slot list: for each needed element, n slots; fill from tray.
  const slots: { symbol: string; cardId?: string }[] = []
  for (const [sym, n] of Object.entries(molecule.formula)) {
    const cards = tray.filter((t) => t.element === sym)
    for (let i = 0; i < n; i++) {
      slots.push({ symbol: sym, cardId: cards[i]?.cardId })
    }
  }

  return (
    <div className="flex min-h-[88px] flex-wrap items-center justify-center gap-x-1 gap-y-2">
      {slots.map((slot, i) => (
        <div key={`${slot.symbol}-${i}`} className="flex items-center justify-center">
          {slot.cardId ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={slot.cardId}
                initial={{ scale: 1.7, opacity: 0, filter: 'blur(8px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              >
                <AtomGlyph symbol={slot.symbol} size={46} state="stable" />
              </motion.div>
            </AnimatePresence>
          ) : (
            <AtomGlyph symbol={slot.symbol} size={46} state="empty" idle={false} />
          )}
        </div>
      ))}
    </div>
  )
}

// A discreet test panel: inject a unique card of any needed element without a
// physical QR. Each press mints a fresh id so dedupe logic still applies.
function SimInjector({ onInject }: { onInject: (raw: string) => void }) {
  const counter = useRef<Record<string, number>>({})
  const elements = Object.keys(ELEMENTS)
  const next = (sym: string) => {
    const n = (counter.current[sym] ?? 0) + 1
    counter.current[sym] = n
    onInject(`${sym}-${String(900 + n).padStart(3, '0')}`)
  }
  return (
    <div className="mt-3 rounded-sm border border-signal/15 bg-void-800/60 p-3">
      <p className="mono mb-2 text-[9px] tracking-[0.25em] text-signal/40">
        TEST INJECTOR · STANDS IN FOR A PRINTED CARD
      </p>
      <div className="flex flex-wrap gap-1.5">
        {elements.map((sym) => (
          <button
            key={sym}
            onClick={() => next(sym)}
            className="mono rounded-sm border border-signal/25 px-2 py-1 text-[11px] text-signal/80 active:bg-signal/10"
            style={{ borderColor: `${ELEMENTS[sym].color}55`, color: ELEMENTS[sym].color }}
          >
            +{sym}
          </button>
        ))}
      </div>
    </div>
  )
}

function Corner({ className }: { className: string }) {
  return <span className={`absolute h-6 w-6 border-signal/70 ${className}`} />
}
