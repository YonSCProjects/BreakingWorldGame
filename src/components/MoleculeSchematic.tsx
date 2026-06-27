import { ELEMENTS } from '../data/elements'
import { MOLECULES } from '../data/molecules'

type Slot = { symbol: string; x: number; y: number; center: boolean }
type Bond = { a: number; b: number; order: number }

type Props = {
  moleculeId: string
  /** how many of each element are currently gathered — lights up slots */
  filled?: Record<string, number>
  size?: number
  className?: string
}

// Lay the molecule out as a small constellation: a core atom with the rest
// arranged around it, joined by bond-sticks. Empty slots are dashed ghosts
// that ignite as the team gathers the right atoms.
function buildLayout(moleculeId: string, size: number): { slots: Slot[]; bonds: Bond[] } {
  const m = MOLECULES[moleculeId]
  if (!m) return { slots: [], bonds: [] }

  const cx = size / 2
  const cy = size / 2
  const ring = size * 0.3

  // Flatten the formula into atoms, center symbol first.
  const center = m.centerSymbol ?? highestValence(m.formula)
  const atoms: string[] = []
  if ((m.formula[center] ?? 0) > 0) atoms.push(center)
  for (const [sym, n] of Object.entries(m.formula)) {
    const start = sym === center ? 1 : 0
    for (let i = start; i < n; i++) atoms.push(sym)
  }

  const total = atoms.length
  const slots: Slot[] = []
  const bonds: Bond[] = []

  if (total === 2) {
    // Linear pair (e.g. O₂): two atoms, one double bond between.
    slots.push({ symbol: atoms[0], x: cx - ring * 0.7, y: cy, center: true })
    slots.push({ symbol: atoms[1], x: cx + ring * 0.7, y: cy, center: false })
    const dbl = m.id === 'oxygen_gas' ? 2 : 1
    bonds.push({ a: 0, b: 1, order: dbl })
    return { slots, bonds }
  }

  if (total > 8) {
    // Big molecule (e.g. glucose): a dense constellation across two rings, no
    // sticks — a dozen+ bond lines would just be a scribble at this size.
    slots.push({ symbol: atoms[0], x: cx, y: cy, center: true })
    const rest = atoms.slice(1)
    const inner = Math.min(rest.length, 8)
    const rings = [
      { r: ring * 0.6, from: 0, to: inner, tip: 0 },
      { r: ring * 1.05, from: inner, to: rest.length, tip: Math.PI / 8 },
    ]
    for (const rg of rings) {
      const count = rg.to - rg.from
      for (let k = 0; k < count; k++) {
        const angle = -Math.PI / 2 + (k * 2 * Math.PI) / count + rg.tip
        slots.push({
          symbol: rest[rg.from + k],
          x: cx + Math.cos(angle) * rg.r,
          y: cy + Math.sin(angle) * rg.r,
          center: false,
        })
      }
    }
    return { slots, bonds }
  }

  // Core + peripherals on a ring.
  slots.push({ symbol: atoms[0], x: cx, y: cy, center: true })
  const peripherals = atoms.slice(1)
  const isLinear = m.id === 'carbon_dioxide'
  peripherals.forEach((sym, i) => {
    let angle: number
    if (isLinear) {
      angle = i === 0 ? Math.PI : 0 // straight line, O=C=O
    } else {
      // spread evenly, tipped so it doesn't sit perfectly flat
      angle = -Math.PI / 2 + (i * 2 * Math.PI) / peripherals.length + Math.PI / 6
    }
    slots.push({
      symbol: sym,
      x: cx + Math.cos(angle) * ring,
      y: cy + Math.sin(angle) * ring,
      center: false,
    })
    const order = m.id === 'carbon_dioxide' ? 2 : 1
    bonds.push({ a: 0, b: slots.length - 1, order })
  })

  return { slots, bonds }
}

function highestValence(formula: Record<string, number>): string {
  return Object.keys(formula).sort(
    (a, b) => (ELEMENTS[b]?.valence ?? 0) - (ELEMENTS[a]?.valence ?? 0),
  )[0]
}

export default function MoleculeSchematic({
  moleculeId,
  filled = {},
  size = 240,
  className = '',
}: Props) {
  const { slots, bonds } = buildLayout(moleculeId, size)
  const atomR = size * 0.085

  // Walk the slots assigning "lit" state by consuming the filled tally.
  const used: Record<string, number> = {}
  const lit = slots.map((s) => {
    used[s.symbol] = (used[s.symbol] ?? 0) + 1
    return used[s.symbol] <= (filled[s.symbol] ?? 0)
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="schematic-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={size * 0.012} />
        </filter>
      </defs>

      {/* bonds first, behind the atoms */}
      {bonds.map((b, i) => {
        const A = slots[b.a]
        const B = slots[b.b]
        const both = lit[b.a] && lit[b.b]
        // double-bond = two parallel lines
        const dx = B.x - A.x
        const dy = B.y - A.y
        const len = Math.hypot(dx, dy) || 1
        const ox = (-dy / len) * (size * 0.018)
        const oy = (dx / len) * (size * 0.018)
        const lines = b.order === 2 ? [-1, 1] : [0]
        return (
          <g key={`bond-${i}`}>
            {lines.map((s, j) => (
              <line
                key={j}
                x1={A.x + ox * s}
                y1={A.y + oy * s}
                x2={B.x + ox * s}
                y2={B.y + oy * s}
                stroke={both ? '#bfefff' : 'rgba(150,170,200,0.3)'}
                strokeWidth={size * 0.012}
                strokeLinecap="round"
                strokeDasharray={both ? undefined : `${size * 0.02} ${size * 0.02}`}
                opacity={both ? 0.9 : 0.6}
                filter={both ? 'url(#schematic-bloom)' : undefined}
                className={both ? '' : ''}
              />
            ))}
          </g>
        )
      })}

      {/* atom slots */}
      {slots.map((s, i) => {
        const el = ELEMENTS[s.symbol]
        const color = el?.color ?? '#888'
        const on = lit[i]
        return (
          <g key={`slot-${i}`} className={on ? 'animate-breathe' : ''} style={{ transformOrigin: `${s.x}px ${s.y}px` }}>
            {on && (
              <circle cx={s.x} cy={s.y} r={atomR * 1.7} fill={color} opacity={0.28} filter="url(#schematic-bloom)" />
            )}
            <circle
              cx={s.x}
              cy={s.y}
              r={atomR}
              fill={on ? color : 'transparent'}
              stroke={color}
              strokeWidth={on ? 1 : 1.5}
              strokeDasharray={on ? undefined : `${size * 0.02} ${size * 0.018}`}
              opacity={on ? 1 : 0.55}
            />
            <text
              x={s.x}
              y={s.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Space Mono', monospace"
              fontWeight={700}
              fontSize={atomR * (s.symbol.length > 1 ? 0.85 : 1.05)}
              fill={on ? '#05060a' : color}
              opacity={on ? 0.95 : 0.6}
            >
              {s.symbol}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
