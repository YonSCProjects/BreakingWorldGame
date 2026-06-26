import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from '../store/session'
import { MISSIONS } from '../data/missions'
import { MOLECULES } from '../data/molecules'
import { ELEMENTS } from '../data/elements'
import AtomGlyph from '../components/AtomGlyph'
import { hapticSeal, hapticLight } from '../utils/haptics'

export default function BondScreen() {
  const idx = useSession((s) => s.session.currentMissionIndex)
  const tray = useSession((s) => s.session.tray)
  const completeBond = useSession((s) => s.completeBond)
  const goto = useSession((s) => s.goto)

  const mission = MISSIONS[idx]
  const molecule = mission ? MOLECULES[mission.targetMoleculeId] : undefined

  const [charge, setCharge] = useState(0)
  const [sealed, setSealed] = useState(false)
  const [hands, setHands] = useState(0)

  const chargeRef = useRef(0)
  const holdingRef = useRef(false)
  const touchesRef = useRef(0)
  const sealedRef = useRef(false)
  const touchModeRef = useRef(false)
  const rafRef = useRef(0)
  const lastRef = useRef(0)

  useEffect(() => {
    const loop = (t: number) => {
      const dt = lastRef.current ? Math.min((t - lastRef.current) / 1000, 0.05) : 0
      lastRef.current = t
      if (!sealedRef.current) {
        const h = Math.max(touchesRef.current, holdingRef.current ? 1 : 0)
        if (h > 0) {
          // more hands on the lattice → faster charge (the multi-touch bonus)
          const rate = 0.34 + 0.16 * Math.min(h - 1, 3)
          chargeRef.current = Math.min(1, chargeRef.current + dt * rate)
          if (chargeRef.current >= 1) seal()
        } else {
          // let go and it slips back — they must hold together
          chargeRef.current = Math.max(0, chargeRef.current - dt * 0.7)
        }
        setCharge(chargeRef.current)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const seal = () => {
    if (sealedRef.current) return
    sealedRef.current = true
    setSealed(true)
    hapticSeal()
    window.setTimeout(() => completeBond(), 900)
  }

  // ── input: touch (multi-finger) with a pointer fallback for desktop ──
  const onTouch = (e: React.TouchEvent) => {
    touchModeRef.current = true
    const n = e.touches.length
    touchesRef.current = n
    holdingRef.current = n > 0
    setHands(n)
    if (n > 0 && chargeRef.current < 0.02) hapticLight()
  }
  const onPointerDown = () => {
    if (touchModeRef.current) return
    holdingRef.current = true
    touchesRef.current = 1
    setHands(1)
    hapticLight()
  }
  const onPointerUp = () => {
    if (touchModeRef.current) return
    holdingRef.current = false
    touchesRef.current = 0
    setHands(0)
  }

  if (!mission || !molecule) return null

  const atoms = trayToAtoms(tray, molecule.formula)
  const R = 96 // ring radius
  const pull = charge * 0.82 // how far atoms strain toward the core

  return (
    <div
      className="relative z-10 flex min-h-full select-none flex-col items-center justify-between px-7 py-10"
      onTouchStart={onTouch}
      onTouchMove={onTouch}
      onTouchEnd={onTouch}
      onTouchCancel={onTouch}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <header className="text-center">
        <p className="mono text-[10px] tracking-[0.35em] text-signal/60">◈ THE BONDING RITUAL</p>
        <h2 className="mono mt-1 text-lg uppercase tracking-[0.25em] text-signal text-glow">
          All hands on the lattice
        </h2>
      </header>

      {/* the ritual stage */}
      <div className="relative flex h-72 w-72 items-center justify-center">
        {/* charge ring */}
        <ChargeRing charge={charge} sealed={sealed} />

        {/* core */}
        <motion.div
          animate={sealed ? { scale: [1, 1.6, 0.9, 1] } : { scale: 1 + charge * 0.25 }}
          transition={sealed ? { duration: 0.6 } : { duration: 0.1 }}
          className="absolute h-10 w-10 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #5ef2ff 60%, transparent 75%)',
            boxShadow: `0 0 ${12 + charge * 60}px ${6 + charge * 24}px rgba(94,242,255,${0.25 + charge * 0.5})`,
          }}
        />

        {/* atoms straining inward */}
        {atoms.map((sym, i) => {
          const angle = (-90 + (360 / atoms.length) * i) * (Math.PI / 180)
          const dist = R * (1 - pull)
          const x = Math.cos(angle) * dist
          const y = Math.sin(angle) * dist
          const jitter = charge > 0.6 ? (charge - 0.6) * 6 : 0
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: '50%', top: '50%' }}
              animate={{
                x: x - 23 + (jitter ? (i % 2 ? jitter : -jitter) : 0),
                y: y - 23,
              }}
              transition={{ type: 'tween', duration: 0.08 }}
            >
              <AtomGlyph symbol={sym} size={46} state={sealed ? 'stable' : 'flicker'} idle={!sealed} />
            </motion.div>
          )
        })}

        {/* seal flash */}
        <AnimatePresence>
          {sealed && (
            <motion.div
              className="pointer-events-none absolute inset-[-60%]"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 0], scale: 2.4 }}
              transition={{ duration: 0.8 }}
              style={{
                background: 'radial-gradient(circle, #ffffff 0%, #5ef2ff 30%, transparent 65%)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* prompt / status */}
      <div className="flex h-20 flex-col items-center justify-center gap-2 text-center">
        {sealed ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mono text-base tracking-[0.3em] text-signal text-glow"
          >
            ⟡ BOUND ⟡
          </motion.p>
        ) : (
          <>
            <p className="mono text-xs leading-relaxed text-[#bfefff]/80">
              {charge < 0.02
                ? 'Press and hold — every hand you can muster — to pull the atoms together.'
                : charge < 0.99
                  ? 'HOLD. The bond is taking. Do not let go.'
                  : 'NOW —'}
            </p>
            {hands > 1 && (
              <p className="mono text-[10px] tracking-[0.25em] text-lattice/80">
                {hands} HANDS · LATTICE RESONATING
              </p>
            )}
          </>
        )}
      </div>

      {/* escape hatch back to the field (in case a card is wrong) */}
      {!sealed && charge < 0.02 && (
        <button
          className="mono absolute bottom-3 text-[10px] tracking-[0.25em] text-signal/30 active:text-signal"
          onClick={() => goto('hunt')}
        >
          ‹ return to the field
        </button>
      )}
    </div>
  )
}

function ChargeRing({ charge, sealed }: { charge: number; sealed: boolean }) {
  const size = 232
  const r = size / 2 - 8
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="absolute" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(94,242,255,0.12)" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={sealed ? '#ffffff' : '#5ef2ff'}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - charge)}
        style={{ filter: `drop-shadow(0 0 ${6 + charge * 16}px #5ef2ff)` }}
      />
    </svg>
  )
}

// Expand the tray into a flat list of element symbols for the ritual ring.
function trayToAtoms(
  tray: { element: string }[],
  formula: Record<string, number>,
): string[] {
  // Prefer the tray order but cap by formula so it always reads correctly.
  const out: string[] = []
  const counts: Record<string, number> = {}
  for (const a of tray) {
    counts[a.element] = (counts[a.element] ?? 0) + 1
    if (counts[a.element] <= (formula[a.element] ?? 0)) out.push(a.element)
  }
  // Sort the core (highest valence) first so it sits visually balanced.
  return out.sort((a, b) => (ELEMENTS[b]?.valence ?? 0) - (ELEMENTS[a]?.valence ?? 0))
}
