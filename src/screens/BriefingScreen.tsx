import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '../store/session'
import { MISSIONS } from '../data/missions'
import { MOLECULES } from '../data/molecules'
import { ELEMENTS } from '../data/elements'
import MoleculeSchematic from '../components/MoleculeSchematic'
import Typewriter from '../components/Typewriter'
import { hapticMedium } from '../utils/haptics'
import { formulaLabel } from '../utils/format'
import { playNarration } from '../utils/audio'

// Plain colour words (feminine, to agree with "יחידת חומר") so kids hunt by
// colour, not chemistry. Singular for 1, plural for 2+.
const COLOR_SING: Record<string, string> = {
  H: 'לבנה',
  O: 'אדומה',
  C: 'אפורה',
  N: 'כחולה',
  Na: 'סגולה',
  Cl: 'ירוקה',
  He: 'זהובה',
  Ne: 'זהובה',
  Ar: 'זהובה',
}
const COLOR_PLUR: Record<string, string> = {
  H: 'לבנות',
  O: 'אדומות',
  C: 'אפורות',
  N: 'כחולות',
  Na: 'סגולות',
  Cl: 'ירוקות',
  He: 'זהובות',
  Ne: 'זהובות',
  Ar: 'זהובות',
}

export default function BriefingScreen() {
  const idx = useSession((s) => s.session.currentMissionIndex)
  const cellName = useSession((s) => s.session.cellName)
  const beginHunt = useSession((s) => s.beginHunt)
  const mission = MISSIONS[idx]
  const [revealed, setRevealed] = useState(false)

  // ראש-המסדר speaks the briefing, then (when it ends) the clue. Hour 2 has no
  // audio yet, so only act 1 plays; the act-complete screen plays the finale.
  useEffect(() => {
    if (!mission) playNarration('cell-complete')
    else if (mission.act === 1) playNarration(`${mission.id}-briefing`, `${mission.id}-clue`)
  }, [mission])

  // Act complete — no further missions in v1.
  if (!mission) {
    return (
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-6 px-8 text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mono text-sm leading-relaxed text-[#bfefff]/90"
        >
          הצלחתם, {cellName}. העולם שוב נושם — בזכותכם. עכשיו נוחו, גיבורים. ראש המסדר גאה בכם.
        </motion.p>
        <p className="mono soft-pulse text-[11px] tracking-[0.3em] text-signal/60">
          ◈ חוליה הושלמה
        </p>
      </div>
    )
  }

  const molecule = MOLECULES[mission.targetMoleculeId]

  return (
    <div className="relative z-10 flex min-h-full flex-col px-7 py-8">
      <header className="flex items-center justify-between border-b border-signal/20 pb-2">
        <span className="mono text-[10px] tracking-[0.3em] text-signal/70">
          ◈ {cellName}
        </span>
        <span className="mono text-[10px] tracking-[0.25em] text-signal/45">
          מערכה {mission.act} · שידור {String(mission.order).padStart(2, '0')}
        </span>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-6 py-6">
        <Typewriter
          text={mission.briefingText}
          speed={15}
          className="mono text-[13px] leading-relaxed text-[#bfefff]/90"
          onDone={() => setRevealed(true)}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0.15 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="mono text-[10px] tracking-[0.35em] text-signal/50">
            מה בונים
          </span>
          <div className="hud-frame rounded-sm bg-void-900/40 p-4">
            <MoleculeSchematic moleculeId={molecule.id} size={210} />
          </div>
          <span className="mono text-xs uppercase tracking-[0.25em] text-signal text-glow">
            {molecule.displayName} · {formulaLabel(molecule.formula)}
          </span>

          {/* hunt-by-colour cue: e.g. ● 2 white   ● 1 red */}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {Object.entries(molecule.formula).map(([sym, n]) => (
              <span key={sym} className="mono flex items-center gap-1.5 text-[11px] tracking-[0.1em] text-[#bfefff]/80">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ background: ELEMENTS[sym]?.color, boxShadow: `0 0 8px ${ELEMENTS[sym]?.color}` }}
                />
                {n} {(n > 1 ? COLOR_PLUR[sym] : COLOR_SING[sym]) ?? ELEMENTS[sym]?.name}
              </span>
            ))}
          </div>
        </motion.div>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-l-2 border-lattice/50 pl-4"
          >
            <p className="mono text-[10px] tracking-[0.3em] text-lattice/70">איפה מחפשים</p>
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
          צאו לציד!
        </motion.button>
      )}
    </div>
  )
}
