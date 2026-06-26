import { AnimatePresence, motion } from 'framer-motion'
import type { ScanOutcome } from '../types'
import { ELEMENTS } from '../data/elements'

// In-world phrasing for every scan outcome. Never "error", never "invalid".
export function outcomeMessage(o: ScanOutcome): { text: string; good: boolean } {
  switch (o.kind) {
    case 'accepted':
      return {
        text: o.ready
          ? `${ELEMENTS[o.element]?.name ?? o.element} locked. The set is complete — all hands to the lattice.`
          : `${ELEMENTS[o.element]?.name ?? o.element} locked into the holding field.`,
        good: true,
      }
    case 'duplicate':
      return { text: 'This atom is already bound — find another.', good: false }
    case 'wrong-element':
      return {
        text: `${ELEMENTS[o.element]?.name ?? o.element} won't hold in this bond. Not what we came for.`,
        good: false,
      }
    case 'already-full':
      return {
        text: `The field already holds all the ${ELEMENTS[o.element]?.name ?? o.element} this bond needs.`,
        good: false,
      }
    case 'noble':
      return {
        text: `${ELEMENTS[o.element]?.name ?? o.element} is sealed — it bonds with nothing. A dead end. Note it and move on.`,
        good: false,
      }
    case 'unknown':
      return { text: 'The signal is noise. That mark means nothing to the Lattice.', good: false }
  }
}

export default function ScanToast({
  scan,
}: {
  scan: (ScanOutcome & { ts: number }) | null
}) {
  return (
    <AnimatePresence>
      {scan && (
        <motion.div
          key={scan.ts}
          initial={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none fixed left-1/2 top-6 z-50 w-[88%] max-w-md -translate-x-1/2"
        >
          <Body scan={scan} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Body({ scan }: { scan: ScanOutcome & { ts: number } }) {
  const { text, good } = outcomeMessage(scan)
  return (
    <div
      className="mono hud-frame rounded-sm px-4 py-3 text-center text-xs leading-relaxed backdrop-blur-md"
      style={{
        background: good ? 'rgba(8,20,24,0.82)' : 'rgba(24,8,14,0.82)',
        borderColor: good ? 'rgba(94,242,255,0.4)' : 'rgba(255,94,122,0.45)',
        color: good ? '#bfefff' : '#ffc2cd',
        textShadow: good ? '0 0 12px rgba(94,242,255,0.4)' : '0 0 12px rgba(255,94,122,0.4)',
      }}
    >
      {text}
    </div>
  )
}
