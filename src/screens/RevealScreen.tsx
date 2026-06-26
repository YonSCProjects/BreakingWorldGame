import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '../store/session'
import { MOLECULES } from '../data/molecules'
import { MISSIONS } from '../data/missions'
import MoleculeSchematic from '../components/MoleculeSchematic'
import Typewriter from '../components/Typewriter'
import CodexCard from '../components/CodexCard'
import { formulaLabel } from '../utils/format'
import { hapticMedium } from '../utils/haptics'

export default function RevealScreen() {
  const revealedId = useSession((s) => s.revealedMoleculeId)
  const continueFromReveal = useSession((s) => s.continueFromReveal)
  const [showCard, setShowCard] = useState(false)

  const molecule = revealedId ? MOLECULES[revealedId] : undefined
  if (!molecule) return null

  return (
    <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-6 px-7 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="mono text-[10px] tracking-[0.35em] text-signal/60">◈ STABILIZED</span>
        <MoleculeSchematic
          moleculeId={molecule.id}
          filled={molecule.formula}
          size={200}
        />
        <h1 className="mono mt-1 text-2xl uppercase tracking-[0.2em] text-signal text-glow">
          {molecule.displayName}
        </h1>
        <span className="mono text-sm tracking-[0.3em] text-signal/70">
          {formulaLabel(molecule.formula)}
        </span>
      </motion.div>

      <div className="min-h-[120px] w-full max-w-md">
        <Typewriter
          text={molecule ? revealTextFor(molecule.id) : ''}
          speed={16}
          className="mono text-center text-[13px] leading-relaxed text-[#bfefff]/90"
          onDone={() => setShowCard(true)}
        />
      </div>

      {showCard && (
        <motion.div
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-5"
          style={{ perspective: 800 }}
        >
          <CodexCard moleculeId={molecule.id} unlocked compact />
          <button
            className="btn-signal w-full text-sm"
            onClick={() => {
              hapticMedium()
              continueFromReveal()
            }}
          >
            Continue the Descent
          </button>
        </motion.div>
      )}
    </div>
  )
}

// Pull the mission's revealText by matching its target molecule. Falls back to
// the codex entry if a molecule is ever reached outside the mission chain.
function revealTextFor(moleculeId: string): string {
  const m = MISSIONS.find((x) => x.targetMoleculeId === moleculeId)
  return m?.revealText ?? MOLECULES[moleculeId]?.codexEntry ?? ''
}
