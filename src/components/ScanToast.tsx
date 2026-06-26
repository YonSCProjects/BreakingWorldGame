import { AnimatePresence, motion } from 'framer-motion'
import type { ScanOutcome } from '../types'
import { ELEMENTS } from '../data/elements'

// In-world phrasing for every scan outcome. Never "error", never "invalid".
// Framed verb-first ("we locked the X") so it stays clean across Hebrew gender.
// First-draft Hebrew — Yon to polish; must echo the Magister's spoken lines.
export function outcomeMessage(o: ScanOutcome): { text: string; good: boolean } {
  switch (o.kind) {
    case 'accepted': {
      const name = ELEMENTS[o.element]?.name ?? o.element
      return {
        text: o.ready
          ? `נעלנו את ה${name}. המערך שלם — כל הידיים אל הסריג.`
          : `נעלנו את ה${name} בשדה האחיזה.`,
        good: true,
      }
    }
    case 'duplicate':
      return { text: 'האטום הזה כבר קשור — מצאו אחר.', good: false }
    case 'wrong-element':
      return {
        text: `ה${ELEMENTS[o.element]?.name ?? o.element} לא יאחז בקשר הזה. לא לזה באנו.`,
        good: false,
      }
    case 'already-full':
      return {
        text: `השדה כבר מחזיק את כל ה${ELEMENTS[o.element]?.name ?? o.element} שהקשר הזה צריך.`,
        good: false,
      }
    case 'noble':
      return {
        text: `ה${ELEMENTS[o.element]?.name ?? o.element} חתום — הוא אינו נקשר לדבר. מבוי סתום. סַמנו והמשיכו.`,
        good: false,
      }
    case 'unknown':
      return { text: 'האות הזה הוא רעש. הסימן הזה אינו אומר דבר לסריג.', good: false }
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
      className="mono hud-frame rounded-sm px-4 py-3 text-center text-sm leading-relaxed backdrop-blur-md"
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
