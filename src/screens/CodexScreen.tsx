import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from '../store/session'
import { ALL_MOLECULE_IDS, MOLECULES } from '../data/molecules'
import { ELEMENTS, ALL_ELEMENT_SYMBOLS } from '../data/elements'
import CodexCard from '../components/CodexCard'
import AtomGlyph from '../components/AtomGlyph'
import Code from '../components/Code'
import { formulaLabel } from '../utils/format'

export default function CodexScreen({ onClose }: { onClose: () => void }) {
  const done = useSession((s) => s.session.codexMolecules)
  const elementsFound = useSession((s) => s.session.codexElements)
  const cellName = useSession((s) => s.session.cellName)
  const [openMol, setOpenMol] = useState<string | null>(null)
  const [openEl, setOpenEl] = useState<string | null>(null)

  const stabilized = done.length
  const total = ALL_MOLECULE_IDS.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[60] overflow-y-auto no-scrollbar bg-void-900/95 backdrop-blur-sm"
    >
      <div className="relative z-10 mx-auto flex max-w-md flex-col gap-6 px-6 py-8">
        <header className="flex items-center justify-between border-b border-signal/20 pb-3">
          <div>
            <h2 className="mono text-sm tracking-[0.3em] text-signal text-glow">
              ◈ הקודקס
            </h2>
            <p className="mono mt-1 text-[11px] tracking-[0.2em] text-signal/50">
              <Code plain>{cellName}</Code> · <Code>{stabilized}/{total}</Code> מיוצבים
            </p>
          </div>
          <button className="btn-ghost text-xs" onClick={onClose}>
            סגירה
          </button>
        </header>

        {/* discovered atoms */}
        <section>
          <p className="mono mb-3 text-[11px] tracking-[0.3em] text-signal/50">אטומים שהתגלו</p>
          <div className="flex flex-wrap gap-1">
            {ALL_ELEMENT_SYMBOLS.map((sym) => {
              const found = elementsFound.includes(sym)
              return (
                <button
                  key={sym}
                  onClick={() => found && setOpenEl(sym)}
                  className="flex items-center justify-center"
                  style={{ opacity: found ? 1 : 0.22 }}
                >
                  <AtomGlyph symbol={sym} size={34} state={found ? 'stable' : 'empty'} idle={false} />
                </button>
              )
            })}
          </div>
        </section>

        {/* molecules */}
        <section>
          <p className="mono mb-3 text-[11px] tracking-[0.3em] text-signal/50">סריגים מיוצבים</p>
          <div className="grid grid-cols-2 gap-3">
            {ALL_MOLECULE_IDS.map((id) => {
              const unlocked = done.includes(id)
              return (
                <CodexCard
                  key={id}
                  moleculeId={id}
                  unlocked={unlocked}
                  onClick={() => unlocked && setOpenMol(id)}
                />
              )
            })}
          </div>
        </section>

        <p className="mono pb-6 text-center text-[10px] leading-relaxed tracking-[0.2em] text-signal/30">
          ההתרה נסוגה היכן שצורה עדיין אוחזת.
        </p>
      </div>

      {/* molecule detail */}
      <AnimatePresence>
        {openMol && (
          <DetailSheet onClose={() => setOpenMol(null)}>
            <span className="mono text-[11px] tracking-[0.35em] text-signal/60">◈ סריג מיוצב</span>
            <h3 className="mono text-xl tracking-[0.2em] text-signal text-glow">
              {MOLECULES[openMol].displayName}
            </h3>
            <span className="mono text-xs tracking-[0.3em] text-signal/60">
              <Code>{formulaLabel(MOLECULES[openMol].formula)}</Code>
            </span>
            <p className="mt-2 text-center text-sm leading-relaxed text-[#bfefff]/85">
              {MOLECULES[openMol].codexEntry}
            </p>
          </DetailSheet>
        )}
      </AnimatePresence>

      {/* element detail */}
      <AnimatePresence>
        {openEl && (
          <DetailSheet onClose={() => setOpenEl(null)}>
            <AtomGlyph symbol={openEl} size={64} />
            <h3 className="mono text-xl tracking-[0.2em] text-glow" style={{ color: ELEMENTS[openEl].color }}>
              {ELEMENTS[openEl].name}
            </h3>
            <span className="mono text-[11px] tracking-[0.25em] text-signal/60">
              {ELEMENTS[openEl].trap ? (
                <>חתום · ערכיות <Code>0</Code></>
              ) : (
                <>ערכיות <Code>{ELEMENTS[openEl].valence}</Code></>
              )}
            </span>
            <p className="mt-2 text-center text-sm leading-relaxed text-[#bfefff]/85">
              {ELEMENTS[openEl].codexEntry}
            </p>
          </DetailSheet>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DetailSheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-void-900/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="hud-frame mb-6 flex w-[90%] max-w-sm flex-col items-center gap-2 rounded-sm bg-void-800/95 px-6 py-7"
      >
        {children}
        <button className="btn-ghost mt-4 text-xs" onClick={onClose}>
          חתמו את הרשומה
        </button>
      </motion.div>
    </motion.div>
  )
}
