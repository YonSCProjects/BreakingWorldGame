import { AnimatePresence, motion } from 'framer-motion'
import type { ScanOutcome } from '../types'
import { ELEMENTS } from '../data/elements'

// Warm, kid-friendly phrasing. Every "yes" celebrates; every "no" is gentle and
// encouraging — never "wrong", never blame.
export function outcomeMessage(o: ScanOutcome): { text: string; good: boolean } {
  switch (o.kind) {
    case 'accepted':
      return {
        text: o.ready
          ? `זהו, יש לכם הכול — הצלחתם! קחו את זה לחדר הבקרה.`
          : `יש! תפסתם ${ELEMENTS[o.element]?.name ?? o.element}. ככה ממשיכים!`,
        good: true,
      }
    case 'duplicate':
      return { text: 'את זה כבר תפסתם — לכו תמצאו יחידת חומר חדשה!', good: false }
    case 'wrong-element':
      return { text: 'לא בשביל הבנייה הזאת — תמשיכו לחפש, אתם מסוגלים!', good: false }
    case 'already-full':
      return {
        text: `יש לכם מספיק ${ELEMENTS[o.element]?.name ?? o.element} — עכשיו לצבע הבא!`,
        good: false,
      }
    case 'noble':
      return { text: 'אופס, זה אוהב להיות לבד — עזבו אותו ותפסו אחר!', good: false }
    case 'unknown':
      return { text: 'הממ, הקליטה על זה קצת מטושטשת. נסו אחד אחר!', good: false }
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
