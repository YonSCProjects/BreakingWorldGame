import { motion } from 'framer-motion'
import { hapticMedium } from '../utils/haptics'

type Choice = 'field' | 'control' | 'solo'

// The first fork: what station is this device? Field phones go hunting;
// the control PC watches over the team; solo is the offline single-device run.
export default function EntryScreen({ onChoose }: { onChoose: (c: Choice) => void }) {
  const pick = (c: Choice) => {
    hapticMedium()
    onChoose(c)
  }
  return (
    <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-8 px-7 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <span className="mono text-[10px] tracking-[0.4em] text-signal/60">◈ המטריקס</span>
        <h1 className="mono text-2xl uppercase tracking-[0.2em] text-signal text-glow">
          שייכו את המכשיר הזה
        </h1>
        <p className="mono mt-1 max-w-xs text-[11px] leading-relaxed text-[#bfefff]/60">
          כל חוליה פועלת משתי עמדות — ידיים בשדה, ועיניים בחדר הבקרה. אמרו למטריקס איזו מהן זו.
        </p>
      </motion.div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <StationButton
          delay={0.05}
          title="מכשיר שדה"
          sub="טלפון בשדה — ציד יחידות חומר, סריקה וקשירה"
          glyph="⌖"
          onClick={() => pick('field')}
        />
        <StationButton
          delay={0.12}
          title="חדר הבקרה"
          sub="עמדת התצפית — עקבו אחרי החוליה, שלחו רמזים, וראו את המטריקס בתלת-ממד."
          glyph="◎"
          onClick={() => pick('control')}
        />
      </div>

      <button
        className="mono mt-2 text-[10px] tracking-[0.25em] text-signal/30 active:text-signal/70"
        onClick={() => pick('solo')}
      >
        ▸ הפעלה לבד · בלי צוות · לא מקוון
      </button>
    </div>
  )
}

function StationButton({
  title,
  sub,
  glyph,
  onClick,
  delay,
}: {
  title: string
  sub: string
  glyph: string
  onClick: () => void
  delay: number
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="hud-frame group flex items-center gap-4 rounded-sm bg-void-800/50 px-5 py-4 text-right active:bg-signal/5"
    >
      <span className="text-3xl text-signal text-glow">{glyph}</span>
      <span className="flex flex-col">
        <span className="mono text-sm uppercase tracking-[0.2em] text-signal">{title}</span>
        <span className="mono mt-1 text-[10px] leading-snug text-[#bfefff]/55">{sub}</span>
      </span>
    </motion.button>
  )
}
