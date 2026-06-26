import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '../store/session'
import { MISSIONS } from '../data/missions'
import { MOLECULES } from '../data/molecules'
import MoleculeSchematic from '../components/MoleculeSchematic'
import Typewriter from '../components/Typewriter'
import Code from '../components/Code'
import { hapticMedium } from '../utils/haptics'
import { formulaLabel } from '../utils/format'

export default function BriefingScreen() {
  const idx = useSession((s) => s.session.currentMissionIndex)
  const cellName = useSession((s) => s.session.cellName)
  const beginHunt = useSession((s) => s.beginHunt)
  const mission = MISSIONS[idx]
  const [revealed, setRevealed] = useState(false)

  // Act complete — no further missions in v1.
  if (!mission) {
    return (
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-6 px-8 text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mono text-sm leading-relaxed text-[#bfefff]/90"
        >
          הירידה אטומה, <Code plain>{cellName}</Code>. כל צורה בשפלה הזו אוחזת בזכותכם.
          הסריג ישדר שוב כשהמערכה הבאה תיפתח.
        </motion.p>
        <p className="mono soft-pulse text-[11px] tracking-[0.3em] text-signal/60">
          ◈ ממתינים לשידור הבא
        </p>
      </div>
    )
  }

  const molecule = MOLECULES[mission.targetMoleculeId]

  return (
    <div className="relative z-10 flex min-h-full flex-col px-7 py-8">
      <header className="flex items-center justify-between border-b border-signal/20 pb-2">
        <span className="mono text-[11px] tracking-[0.3em] text-signal/70">
          ◈ <Code plain>{cellName}</Code>
        </span>
        <span className="mono text-[11px] tracking-[0.25em] text-signal/45">
          מערכה <Code>{mission.act}</Code> · שידור{' '}
          <Code>{String(mission.order).padStart(2, '0')}</Code>
        </span>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-6 py-6">
        <Typewriter
          text={mission.briefingText}
          speed={15}
          className="mono text-[15px] leading-relaxed text-[#bfefff]/90"
          onDone={() => setRevealed(true)}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0.15 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="mono text-[11px] tracking-[0.35em] text-signal/50">
            הסריג המבוקש
          </span>
          <div className="hud-frame rounded-sm bg-void-900/40 p-4">
            <MoleculeSchematic moleculeId={molecule.id} size={210} />
          </div>
          <span className="mono text-sm tracking-[0.25em] text-signal text-glow">
            {molecule.displayName} · <Code>{formulaLabel(molecule.formula)}</Code>
          </span>
        </motion.div>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-s-2 border-lattice/50 ps-4"
          >
            <p className="mono text-[11px] tracking-[0.3em] text-lattice/70">רמז</p>
            <p className="mt-1 text-sm leading-relaxed text-[#d7c8ff]/90">{mission.clueText}</p>
          </motion.div>
        )}
      </div>

      {revealed && (
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="btn-signal w-full text-sm"
          onClick={() => {
            hapticMedium()
            beginHunt()
          }}
        >
          התחילו במצוד
        </motion.button>
      )}
    </div>
  )
}
