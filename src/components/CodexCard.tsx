import { MOLECULES } from '../data/molecules'
import MoleculeSchematic from './MoleculeSchematic'
import { formulaLabel } from '../utils/format'

type Props = {
  moleculeId: string
  unlocked: boolean
  compact?: boolean
  onClick?: () => void
}

// A single Codex entry. Unlocked = the stabilized lattice in full glow.
// Locked = a dashed silhouette of the same structure: you can see the shape
// of what's missing, never its name.
export default function CodexCard({ moleculeId, unlocked, compact, onClick }: Props) {
  const m = MOLECULES[moleculeId]
  const schSize = compact ? 120 : 104

  return (
    <button
      onClick={onClick}
      className="hud-frame group relative flex flex-col items-center gap-2 rounded-sm p-3"
      style={{
        background: unlocked ? 'rgba(8,16,24,0.6)' : 'rgba(6,8,14,0.5)',
        width: compact ? 220 : '100%',
      }}
    >
      <div className={unlocked ? '' : 'opacity-40 blur-[1px] grayscale'}>
        <MoleculeSchematic
          moleculeId={moleculeId}
          filled={unlocked ? m.formula : {}}
          size={schSize}
        />
      </div>

      {unlocked ? (
        <>
          <span className="mono text-xs uppercase tracking-[0.18em] text-signal text-glow">
            {m.displayName}
          </span>
          <span className="mono text-[10px] tracking-[0.25em] text-signal/60">
            {formulaLabel(m.formula)}
          </span>
        </>
      ) : (
        <>
          <span className="mono text-xs tracking-[0.3em] text-signal/40">— — —</span>
          <span className="mono text-[9px] tracking-[0.25em] text-signal/30">לא מיוצב</span>
        </>
      )}
    </button>
  )
}
