import { ELEMENTS } from '../data/elements'

type Props = {
  symbol: string
  /** diameter in px of the atom body */
  size?: number
  /** 'flicker' = half-dissolved, not yet locked. 'stable' = materialized. */
  state?: 'flicker' | 'stable' | 'empty'
  /** how many of its hands are currently clasped in a bond */
  bonded?: number
  showHands?: boolean
  className?: string
  idle?: boolean // breathe + drift when true
}

// A single atom rendered as a small glowing creature. Its "hands" (short
// radiating limbs) number exactly its valence — the visual grammar of how
// many bonds it can hold.
export default function AtomGlyph({
  symbol,
  size = 64,
  state = 'stable',
  bonded = 0,
  showHands = true,
  className = '',
  idle = true,
}: Props) {
  const el = ELEMENTS[symbol]
  const color = el?.color ?? '#888'
  const hands = el?.valence ?? 0
  const box = size * 2.4 // room for hands + glow
  const c = box / 2
  const r = size / 2

  const empty = state === 'empty'
  const flicker = state === 'flicker'

  return (
    <div
      className={`${className} ${idle && !empty ? 'animate-drift' : ''}`}
      style={{ width: box, height: box, position: 'relative' }}
    >
      <svg
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        style={{ overflow: 'visible' }}
        className={flicker ? 'animate-flicker' : ''}
      >
        <defs>
          <radialGradient id={`g-${symbol}`} cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={empty ? 0.15 : 0.95} />
            <stop offset="40%" stopColor={color} stopOpacity={empty ? 0.18 : 1} />
            <stop offset="100%" stopColor={color} stopOpacity={empty ? 0.05 : 0.55} />
          </radialGradient>
          <filter id={`blur-${symbol}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation={size * 0.16} />
          </filter>
        </defs>

        {/* hands: short limbs radiating from the body, evenly spread */}
        {showHands &&
          Array.from({ length: hands }).map((_, i) => {
            const a = (-90 + (360 / Math.max(hands, 1)) * i) * (Math.PI / 180)
            const innerR = r * 0.9
            const outerR = r * 1.62
            const x1 = c + Math.cos(a) * innerR
            const y1 = c + Math.sin(a) * innerR
            const x2 = c + Math.cos(a) * outerR
            const y2 = c + Math.sin(a) * outerR
            const clasped = i < bonded
            return (
              <g key={i} opacity={empty ? 0.25 : 1}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={size * 0.07}
                  strokeLinecap="round"
                  opacity={clasped ? 0.95 : 0.5}
                />
                <circle
                  cx={x2}
                  cy={y2}
                  r={size * (clasped ? 0.08 : 0.06)}
                  fill={clasped ? '#fff' : color}
                  opacity={clasped ? 1 : 0.7}
                />
              </g>
            )
          })}

        {/* soft outer bloom */}
        {!empty && (
          <circle
            cx={c}
            cy={c}
            r={r}
            fill={color}
            filter={`url(#blur-${symbol})`}
            opacity={flicker ? 0.4 : 0.7}
          />
        )}

        {/* the body */}
        <circle
          cx={c}
          cy={c}
          r={r}
          fill={empty ? 'transparent' : `url(#g-${symbol})`}
          stroke={color}
          strokeWidth={empty ? 1.5 : 1}
          strokeDasharray={empty ? '4 5' : undefined}
          opacity={empty ? 0.5 : 1}
          className={idle && !empty && !flicker ? 'animate-breathe' : ''}
          style={{ transformOrigin: 'center', transformBox: 'fill-box' } as React.CSSProperties}
        />

        {/* the symbol */}
        <text
          x={c}
          y={c}
          textAnchor="middle"
          dominantBaseline="central"
          direction="ltr"
          fontFamily="'Space Mono', monospace"
          fontWeight={700}
          fontSize={size * (symbol.length > 1 ? 0.42 : 0.52)}
          fill={empty ? color : '#05060a'}
          opacity={empty ? 0.5 : 0.92}
          style={{ paintOrder: 'stroke' }}
        >
          {symbol}
        </text>
      </svg>
    </div>
  )
}
